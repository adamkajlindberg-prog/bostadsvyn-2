import { generateEmbeddings } from "../apps/site/src/lib/ai/embedding"
import { setTimeoutDelay } from "../apps/site/src/utils/set-timeout-delay"
import { getDbClient, riksbankSwea, riksbankSweaObservations } from "../packages/db"

type T_Api_Response = {
    seriesId: string
    source: string
    shortDescription: string
    midDescription: string
    longDescription: string
    groupId: number
    observationMaxDate: string
    observationMinDate: string
    seriesClosed: boolean
}

const BATCH_SIZE = 100

// Simple argument parser for --dateFrom and --dateTo
const getArg = (flag: string) => {
    const arg = process.argv.find(a => a.startsWith(flag + "="))
    return arg ? arg.split("=")[1] : undefined
}

const dateFrom = getArg("--dateFrom") || ""
const dateTo = getArg("--dateTo") || ""

// Retrieve all SWEA series data
const getAllSeries = async () => {
    const response = await fetch("https://api.riksbank.se/swea/v1/Series")
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()
    return data
}

// Insert or update SWEA series and observations into DB
const upsertData = async (data: T_Api_Response[], dateFrom: string, dateTo: string) => {
    const db = getDbClient()

    // Special case for certain series to use longDescription instead of midDescription in embedding
    const specialCaseIds = [
        "SEDPT_NSTIBORDELAYC",
        "SEDP1WSTIBORDELAYC",
        "SEDP1MSTIBORDELAYC",
        "SEDP2MSTIBORDELAYC",
        "SEDP3MSTIBORDELAYC",
        "SEDP6MSTIBORDELAYC"
    ]

    for (const item of data) {
        const dataToEmbed = specialCaseIds.includes(item.seriesId)
            ? [item.shortDescription, item.longDescription].filter(Boolean).join(", ")
            : [item.shortDescription, item.midDescription].filter(Boolean).join(", ")

        const embeddingQuery = await generateEmbeddings(dataToEmbed)

        console.log(`Processing SWEA with series_id: ${item.seriesId} (${item.shortDescription})`)

        // Upsert SWEA series and get its id
        const upserted = await db
            .insert(riksbankSwea)
            .values({
                ...item,
                embedding: embeddingQuery[0].embedding
            })
            .onConflictDoUpdate({
                target: riksbankSwea.seriesId,
                set: {
                    observationMaxDate: item.observationMaxDate,
                    updatedAt: new Date(),
                    embedding: embeddingQuery[0].embedding
                },
            })
            .returning({ id: riksbankSwea.id })

        const sweaId = upserted[0]?.id
        if (!sweaId) continue

        // Fetch observations for the series within the date range
        const response = await fetch(`https://api.riksbank.se/swea/v1/Observations/${item.seriesId}/${dateFrom}/${dateTo}`)
        const observations = await response.json()

        // Skip to next series if no observations
        if (!observations || observations.length === 0) {
            console.log("No observations found for this series in the given date range, skipping...")
            continue
        }

        // Upsert observations by batch
        for (let i = 0; i < observations.length; i += BATCH_SIZE) {
            const batch = observations.slice(i, i + BATCH_SIZE)
            
            console.log(
                `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(observations.length / BATCH_SIZE)}...`
            )

            await db.transaction(async (tx) => {
                for (const observation of batch) {
                    await tx
                        .insert(riksbankSweaObservations)
                        .values({
                            sweaId,
                            date: observation.date,
                            value: observation.value,
                        })
                        .onConflictDoUpdate({
                            target: [riksbankSweaObservations.sweaId, riksbankSweaObservations.date],
                            set: {
                                value: observation.value,
                                updatedAt: new Date(),
                            },
                        })
                }
            })
            console.log(`Batch processed.`)

            await setTimeoutDelay(3000) // 3 seconds delay after each batch
        }
        await setTimeoutDelay(15000) // 15 seconds delay between series to avoid rate limit per minute
    }
}

// Main function to populate SWEA data by date range
const populateSweaData = async (dateFrom: string, dateTo: string) => {
    if (!dateFrom || !dateTo) {
        console.error(`Error: You must provide date range (--dateFrom="YYYY-MM-DD" --dateTo="YYYY-MM-DD") in the script.`)
        process.exit(1)
    }

    console.log("Retrieving data from Riksbank API (SWEA)...")
    console.log(`Using date range: ${dateFrom} to ${dateTo}`)
    const series = await getAllSeries()

    await upsertData(series, dateFrom, dateTo)
    console.log("SUCCESS! All SWEA data populated successfully.")
}

/** 
Example command to run the script:
bun scripts/populate-swea-data --dateFrom="2025-11-01" --dateTo="2025-11-24"
*/  
populateSweaData(dateFrom, dateTo)

