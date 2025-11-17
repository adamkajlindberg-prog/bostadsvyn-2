import { generateText } from "ai";
import { AI_CHAT_AGENT } from "../../../../env-server";
import {google, openai, OPENAI_CHAT_MODEL, GEMINI_CHAT_MODEL } from "@/lib/ai/utils";

const getSweaObservation = async (question: string) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        // Get series data
        const series = await fetch(`https://api.riksbank.se/swea/v1/Series?language=sv`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        const seriesData = await series.json()
        
        // Intialize prompt for AI to extract relevant series ID
        const prompt = `Given the following list:

        **Series:**
        ${JSON.stringify(seriesData)}

        User question: "${question}"

        For the user question above:
        1. Extract the most relevant series (series_id) by finding the nearest match in each list based on context and similarity (not by manual mapping).
        2. Extract the desired date from the question if provided. If the question mentions a relative date (e.g., "yesterday", "last week"), convert it to an explicit date in YYYY-MM-DD format using "${today}" as the base date. If no date is mentioned or the question relates to today's date, use "${today}" as the date.

        Return the result in this format:

        {
            seriesId: <nearest matching series_id>,
            date: <desired date or today's date in YYYY-MM-DD format>
        }

        Only output the JSON object as shown above.`

        
        const initialPrompt = await generateText({
            prompt: prompt,
            model: AI_CHAT_AGENT === "GEMINI" ? google(GEMINI_CHAT_MODEL) : openai(OPENAI_CHAT_MODEL),
        })

        // Parse the JSON from the AI response
        let extracted;
        try {
            const text = initialPrompt.text.replace(/```json|```/g, '').trim();
            extracted = JSON.parse(text);
        } catch (e) {
            throw new Error('Failed to parse AI response');
        }

        const { seriesId, date } = extracted;

        // Fetch observation data
        const response = await fetch(`https://api.riksbank.se/swea/v1/Observations/${seriesId}/${date}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })

        const data = await response.json();

        return JSON.stringify(data)
    } catch (error) {
        console.error('Fetch failed (SWEA API). Error:', error);
        return 'Could not retrieve information from the SWEA API at this time.';
    }
}

export default getSweaObservation