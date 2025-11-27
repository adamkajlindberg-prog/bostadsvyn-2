import { getDbClient, riksbankSwestrCompoundedAverage } from "../packages/db"

// Main function to populate latest SWESTR compounded data
const populateLatestSwestrCompoundedAverageData = async () => {
    const db = getDbClient()

    console.log("Retrieving latest data from Riksbank API (SWESTR - Compounded Average)...")
    
    const response = await fetch("https://api.riksbank.se/swestr/v1/avg/latest/SWESTRAVG1W")
    const data = await response.json()

    console.log("Upserting data...")

    // Insert or update SWESTR compounded average into DB
    await db
    .insert(riksbankSwestrCompoundedAverage)
    .values({
        rate: data.rate,
        date: data.date,
        startDate: data.startDate,
        publicationTime: new Date(data.publicationTime),
        republication: data.republication
    })
    .onConflictDoUpdate({
        target: riksbankSwestrCompoundedAverage.date,
        set: {
            rate: data.rate,
            date: data.date,
            startDate: data.startDate,
            publicationTime: new Date(data.publicationTime),
            republication: data.republication,
            updatedAt: new Date()
        },
    })

    console.log("Data upserted.")
    console.log("SUCCESS! Latest SWESTR compounded average data populated successfully.")
}

populateLatestSwestrCompoundedAverageData()