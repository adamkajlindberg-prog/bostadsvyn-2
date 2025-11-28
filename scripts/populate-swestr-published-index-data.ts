import { setTimeoutDelay } from "../apps/site/src/utils/set-timeout-delay"
import { getDbClient, riksbankSwestrPublishedIndex } from "../packages/db"

const BATCH_SIZE = 100

const db = getDbClient()

// Simple argument parser for --dateFrom and --dateTo
const getArg = (flag: string) => {
    const arg = process.argv.find(a => a.startsWith(flag + "="))
    return arg ? arg.split("=")[1] : undefined
}

const dateFrom = getArg("--dateFrom") || ""
const dateTo = getArg("--dateTo") || ""

// Main function to populate SWESTR published index data by date range
const populateSwestrPublishedIndexData = async (dateFrom: string, dateTo: string) => {
    if (!dateFrom || !dateTo) {
        console.error(`Error: You must provide date range (--dateFrom="YYYY-MM-DD" --dateTo="YYYY-MM-DD") in the script.`)
        process.exit(1)
    }

    console.log("Retrieving data from Riksbank API (SWESTR - Published Index)...")
    console.log(`Using date range: ${dateFrom} to ${dateTo}`)
    
    const response = await fetch(`https://api.riksbank.se/swestr/v1/index/SWESTRINDEX?fromDate=${dateFrom}&toDate=${dateTo}`)
    const data = await response.json()

    // Insert or update data in batches
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE)
        
        console.log(
            `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(data.length / BATCH_SIZE)}...`
        )

        await db.transaction(async (tx) => {
            for (const item of batch) {
                await tx
                    .insert(riksbankSwestrPublishedIndex)
                    .values({
                        value: item.value,
                        date: item.date,
                        publicationTime: new Date(item.publicationTime),
                        republication: item.republication,
                    })
                    .onConflictDoUpdate({
                        target: riksbankSwestrPublishedIndex.date,
                        set: {
                            value: item.value,
                            date: item.date,
                            publicationTime: new Date(item.publicationTime),
                            republication: item.republication,
                            updatedAt: new Date()
                        },
                    })
            }
        })
        console.log(`Batch processed.`)

        await setTimeoutDelay(3000) // 3 seconds delay after each batch
    }

    console.log("SUCCESS! All SWESTR published index data populated successfully.")
}

/** 
Example command to run the script:
bun scripts/populate-swestr-published-index-data --dateFrom="2025-11-01" --dateTo="2025-11-20"
*/  
populateSwestrPublishedIndexData(dateFrom, dateTo)