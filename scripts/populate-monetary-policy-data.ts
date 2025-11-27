import { generateEmbeddings } from "../apps/site/src/lib/ai/embedding"
import { setTimeoutDelay } from "../apps/site/src/utils/set-timeout-delay"
import { getDbClient, riksbankMonetaryPolicy, riksbankVintages } from "../packages/db"

type T_Api_Response = {
    data: {
        external_id: string
        metadata: {
            description: string
            source_agency: string
            unit: string
            note: string
            start_date: string
        }
        vintages: {
            metadata: {
                forecast_cutoff_date: string
                policy_round: string
                policy_round_end_dtm: string
            }
            observations: {
                date: string
                value: number
            }
        }[]
    }[]
}

const BATCH_SIZE = 100

// Retrieve all monetary policy data
const getAllMonetaryPolicy = async () => {
    const response = await fetch("https://api.riksbank.se/monetary_policy_data/v1/forecasts")
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()
    return data
}

// Insert or update monteray policy and vintages data into DB
const upsertData = async (apiData: T_Api_Response) => {
    const db = getDbClient()

    for (const item of apiData.data) {
        const dataToEmbed = [
            item.metadata.description,
            item.metadata.source_agency,
            item.metadata.unit,
            item.metadata.note
        ].filter(Boolean).join(", ")

        const embeddingQuery = await generateEmbeddings(dataToEmbed)

        const policyData = {
            externalId: item.external_id,
            description: item.metadata.description,
            sourceAgency: item.metadata.source_agency,
            unit: item.metadata.unit,
            note: item.metadata.note,
            startDate: item.metadata.start_date,
            embedding: embeddingQuery[0].embedding,
        }

        console.log(`Processing monetary policy with external_id: ${policyData.externalId} (${policyData.description})`)

        // Upsert monetary policy and get its id
        const upserted = await db
            .insert(riksbankMonetaryPolicy)
            .values(policyData)
            .onConflictDoUpdate({
                target: riksbankMonetaryPolicy.externalId,
                set: {
                    description: policyData.description,
                    sourceAgency: policyData.sourceAgency,
                    unit: policyData.unit,
                    note: policyData.note,
                    startDate: policyData.startDate,
                    updatedAt: new Date(),
                    embedding: policyData.embedding
                },
            })
            .returning({ id: riksbankMonetaryPolicy.id })

        const monetaryPolicyId = upserted[0]?.id
        if (!monetaryPolicyId || !item.vintages || !item.vintages.length) continue

        // Prepare vintages
        const vintages = item.vintages
            .filter(v => v.metadata.policy_round_end_dtm)
            .map(v => ({
                monetaryPolicyId,
                forecastCutoffDate: v.metadata.forecast_cutoff_date,
                policyRound: v.metadata.policy_round,
                policyRoundEndDtm: v.metadata.policy_round_end_dtm,
                observations: v.observations,
            }))

        // Upsert vintages by batch
        for (let i = 0; i < vintages.length; i += BATCH_SIZE) {
            const batch = vintages.slice(i, i + BATCH_SIZE)

            console.log(
                `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(vintages.length / BATCH_SIZE)}...`
            )

            await db.transaction(async (tx) => {
                for (const vintage of batch) {
                    await tx
                        .insert(riksbankVintages)
                        .values(vintage)
                        .onConflictDoUpdate({
                            target: [
                                riksbankVintages.monetaryPolicyId,
                                riksbankVintages.policyRoundEndDtm,
                                riksbankVintages.policyRound,
                            ],
                            set: {
                                forecastCutoffDate: vintage.forecastCutoffDate,
                                observations: vintage.observations,
                                updatedAt: new Date(),
                            },
                        })
                }
            })
            console.log(`Batch processed.`)

            await setTimeoutDelay(3000) // 3 seconds delay after each batch
        }
    }
}

// Main function to populate monetary policy data
const populateMonetaryPolicyData = async () => {
    console.log("Retrieving data from Riksbank API (Monetary Policy Data)...")
    const monetaryPolicyData = await getAllMonetaryPolicy()

    await upsertData(monetaryPolicyData)
    console.log(`SUCCESS! Inserted/updated ${monetaryPolicyData.data.length} monetary policy records.`)
}

populateMonetaryPolicyData()