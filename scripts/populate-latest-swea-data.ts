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

// Retrieve all SWEA series data
const getAllSeries = async () => {
    const response = await fetch("https://api.riksbank.se/swea/v1/Series")
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()
    return data
}

// Insert or update SWEA series and observations into DB
const upsertData = async (data: T_Api_Response[]) => {
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

        console.log(`Processing latest SWEA with series_id: ${item.seriesId} (${item.shortDescription})`)

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

        await setTimeoutDelay(20000) // 20 seconds delay between series to avoid rate limit per minute

        // Fetch observations for the series within the date range
        const response = await fetch(`https://api.riksbank.se/swea/v1/Observations/Latest/${item.seriesId}`)
        const observation = await response.json()

        // Upsert observation data
        console.log("Upserting data...")
        await db
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

        console.log("Data upserted.")
    }
}

// Main function to populate latest SWEA data
const populateLatestSweaData = async () => {
    console.log("Retrieving latest data from Riksbank API (SWEA)...")
    const series = await getAllSeries()

    await upsertData(series)
    console.log("SUCCESS! Latest SWEA data populated successfully.")
}

populateLatestSweaData()