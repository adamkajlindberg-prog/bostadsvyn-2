import { generateEmbeddings } from "../apps/site/src/lib/ai/embedding"
import { getDbClient, policeEvents } from "../packages/db"
import { chunkArray } from "../apps/site/src/utils/chunk-array"
import { setTimeoutDelay } from "../apps/site/src/utils/set-timeout-delay"

type T_Police_Event = {
    id: number
    datetime: string
    name: string
    summary: string
    url: string
    type: string
    location: {
        name: string
        gps: string
    }
}

const BATCH_SIZE = 100

const db = getDbClient()

// Retrieve existing police events from DB
const getExistingData = async () => {
    const data = await db.select({ policeEventId: policeEvents.policeEventId }).from(policeEvents)

    return data.map(row => row.policeEventId)
}

// Retrieve all police events
const getAllPoliceEvents = async () => {
    const response = await fetch("https://polisen.se/api/events")
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()
    return data
}

// Insert batch of police events through transaction into DB
const insertBatch = async (batch: T_Police_Event[]) => {
    await db.transaction(async (tx) => {
        for (const event of batch) {
            if (!event) continue

            const embeddingQuery = await generateEmbeddings(event.location.name)

            const [lat, lng] = event.location.gps.split(",").map(Number)

            await tx.insert(policeEvents).values({
                policeEventId: event.id,
                embedding: embeddingQuery[0].embedding,
                datetime: event.datetime,
                name: event.name,
                summary: event.summary,
                url: event.url,
                type: event.type,
                locationName: event.location.name,
                locationGpsLat: lat,
                locationGpsLng: lng,
            })
        }
    })
}

// Main function to populate police events data
const populatePoliceEventsData = async () => {
    try {
        console.log("Retrieving data from Police Events API...")
        const existingData = await getExistingData()
        const policeEvents = await getAllPoliceEvents()

        const freshEvents = policeEvents.filter(
            (event: T_Police_Event) => !existingData.includes(event.id)
        )

        const batches: T_Police_Event[][] = chunkArray(freshEvents, BATCH_SIZE)
        const totalBatches = batches.length
        
        for (const batchEvents of batches) {
            const batchNumber = batches.indexOf(batchEvents)
            console.log(`Inserting police events batch ${batchNumber + 1}/${totalBatches} (${batchEvents.length} events)...`)

            await insertBatch(batchEvents)
            console.log(`Inserted police events batch ${batchNumber + 1}/${totalBatches}.`)

            await setTimeoutDelay(5000) // 5 seconds delay after each batch
        }

        console.log("SUCCESS! Police Events data population completed.")
    } catch (error) {
        console.error("Fetch failed (Police Events API). Error:", error)
    }
}

populatePoliceEventsData()