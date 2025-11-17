import dotenv from 'dotenv'

dotenv.config({path: '../../.env'})

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

export const EMBEDDING_DIMENSIONALITY = process.env.EMBEDDING_DIMENSIONALITY ? parseInt(process.env.EMBEDDING_DIMENSIONALITY) : 1536
export const AI_CHAT_AGENT = process.env.AI_CHAT_AGENT || 'OPENAI'

export const TRAFIKVERKET_API_KEY = process.env.TRAFIKVERKET_API_KEY || ''