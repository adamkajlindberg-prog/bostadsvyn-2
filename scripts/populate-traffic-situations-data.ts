import { generateEmbeddings } from "../apps/site/src/lib/ai/embedding"
import { getDbClient, trafficSituations } from "../packages/db"
import { chunkArray } from "../apps/site/src/utils/chunk-array"
import { setTimeoutDelay } from "../apps/site/src/utils/set-timeout-delay"
import { env } from "../packages/db/env"

type T_Traffic_Situation = {
  trafficId: string
  countryCode: string
  roadName?: string
  roadNumber?: string
  locationDescriptor: string | null
  coordinates: string | null
  messageType: string | null
  messageTypeValue: string | null
  messageCode: string | null
  messageCodeValue: string | null
  message: string | null
  severityCode?: number
  severityText?: string
  startTime: string
  endTime?: string
  validUntilFurtherNotice?: boolean
  webLink?: string
  countyNo: number[]
  affectedDirection?: string
  affectedDirectionValue?: string
  trafficRestrictionType?: string
  numberOfLanesRestricted?: number
}

type T_Geometry = {
  WGS84?: string
}

type T_Deviation = {
  Id?: string
  RoadName?: string
  RoadNumber?: string
  LocationDescriptor: string
  Geometry?: T_Geometry
  MessageType: string
  MessageTypeValue: string
  MessageCode: string
  MessageCodeValue: string
  Message: string
  SeverityCode?: number
  SeverityText?: string
  StartTime: string
  EndTime?: string
  ValidUntilFurtherNotice?: boolean
  WebLink?: string
  CountyNo?: number[]
  AffectedDirection?: string
  AffectedDirectionValue?: string
  TrafficRestrictionType?: string
  NumberOfLanesRestricted?: number
}

type T_Situation = {
  Id: string
  CountryCode: string
  Deviation?: T_Deviation[]
}

type T_Api_Result = {
  Situation: T_Situation[]
}

type T_Api_Response = {
  RESPONSE?: {
    RESULT?: T_Api_Result[]
  }
}

const BATCH_SIZE = 100

const db = getDbClient()

// Retrieve existing traffic situations from DB
const getExistingData = async () => {
    const data = await db.select({ trafficId: trafficSituations.trafficId }).from(trafficSituations)

    return data.map(row => row.trafficId)
}

// Retrieve all traffic situations
const getAllTrafficSituations = async () => {
    const response = await fetch(`https://api.trafikinfo.trafikverket.se/v2/data.json`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/xml',
        },
        // You can also add limit of records here if needed. Just add `limit="number"` to the QUERY tag.
        body: `
            <REQUEST>
                <LOGIN authenticationkey="${env.TRAFIKVERKET_API_KEY}" />
                <QUERY objecttype="Situation" namespace="road.trafficinfo" schemaversion="1.6">
                    <FILTER></FILTER>
                </QUERY>
            </REQUEST>
        `
    })

    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()
    return data
}

const prepareData = (data: T_Api_Response): T_Traffic_Situation[] => {
  if (!data?.RESPONSE?.RESULT) return []

  return data.RESPONSE.RESULT.flatMap((result) =>
    result.Situation.flatMap((situation) =>
      (situation.Deviation || []).map((dev) => ({
        trafficId: dev.Id || situation.Id,
        countryCode: situation.CountryCode,
        roadName: dev.RoadName,
        roadNumber: dev.RoadNumber,
        locationDescriptor: dev.LocationDescriptor,
        coordinates: dev?.Geometry?.WGS84 || null,
        messageType: dev.MessageType,
        messageTypeValue: dev.MessageTypeValue,
        messageCode: dev.MessageCode,
        messageCodeValue: dev.MessageCodeValue,
        message: dev.Message,
        severityCode: dev.SeverityCode,
        severityText: dev.SeverityText,
        startTime: dev.StartTime,
        endTime: dev.EndTime,
        validUntilFurtherNotice: dev.ValidUntilFurtherNotice,
        webLink: dev.WebLink,
        countyNo: dev.CountyNo || [],
        affectedDirection: dev.AffectedDirection,
        affectedDirectionValue: dev.AffectedDirectionValue,
        trafficRestrictionType: dev.TrafficRestrictionType,
        numberOfLanesRestricted: dev.NumberOfLanesRestricted,
      }))
    )
  )
}

// Insert batch of traffic situations through transaction into DB
const insertBatch = async (batch: T_Traffic_Situation[]) => {
    await db.transaction(async (tx) => {
        for (const item of batch) {
            if (!item) continue

            if (!item.locationDescriptor && !item.roadName) continue // skip if both locationDescriptor and roadName are missing

            const dataToEmbed = [
                item.locationDescriptor,
                item.roadName
            ].filter(Boolean).join(", ")

            const embeddingQuery = await generateEmbeddings(dataToEmbed)

            await tx.insert(trafficSituations).values({
                ...item,
                embedding: embeddingQuery[0].embedding
            })
        }
    })
}

// Main function to populate traffic situations data
const populateTrafficSituationsData = async () => {
    try {
        console.log("Retrieving data from Trafikverket API...")
        const existingData = await getExistingData()
        const trafficSituations = await getAllTrafficSituations()
        const allSituations = prepareData(trafficSituations)

        const freshSituations = allSituations.filter(
            (situation: T_Traffic_Situation) => !existingData.includes(situation.trafficId)
        )

        const batches: T_Traffic_Situation[][] = chunkArray(freshSituations, BATCH_SIZE)
        const totalBatches = batches.length
        
        for (const batchEvents of batches) {
            const batchNumber = batches.indexOf(batchEvents)
            console.log(`Inserting traffic situations batch ${batchNumber + 1}/${totalBatches} (${batchEvents.length} situations)...`)

            await insertBatch(batchEvents)
            console.log(`Inserted traffic situations batch ${batchNumber + 1}/${totalBatches}.`)

            await setTimeoutDelay(5000) // 5 seconds delay after each batch
        }

        console.log("SUCCESS! Traffic Situations data population completed.")
    } catch (error) {
        console.error("Fetch failed (Trafikverket API). Error:", error)
    }
}

populateTrafficSituationsData()