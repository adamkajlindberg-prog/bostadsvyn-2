import { generateText } from "ai"
import { AI_CHAT_AGENT } from "../../../../env-server";
import {google, openai, OPENAI_CHAT_MODEL, GEMINI_CHAT_MODEL } from "@/lib/ai/utils";

const getMonetaryPolicyData = async (question: string) => {
    try {
        // Get policy rounds data
        const policyRounds = await fetch(`https://api.riksbank.se/monetary_policy_data/v1/forecasts/policy_rounds`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        // Get series data
        const series = await fetch(`https://api.riksbank.se/monetary_policy_data/v1/forecasts/series_ids`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        const policyRoundsData = await policyRounds.json();
        const seriesData = await series.json();

        // Intialize prompt for AI to extract relevant policy round and series ID
        const prompt = `Given the following lists:

        **Policy Rounds:**
        ${JSON.stringify(policyRoundsData)}

        **Series:**
        ${JSON.stringify(seriesData)}

        User question: "${question}"

        For the user question above, extract the most relevant policy_round_name and series (series_id) by finding the nearest match in each list based on context and similarity (not by manual mapping). Return the result in this format:

        {
            policyRoundName: <nearest matching policy round>,
            seriesId: <nearest matching series_id>
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

        const { policyRoundName, seriesId } = extracted;

        // Fetch monetary policy data
        const response = await fetch(`https://api.riksbank.se/monetary_policy_data/v1/forecasts?policy_round_name=${policyRoundName}&series=${seriesId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })

        const data = await response.json();

        return JSON.stringify(data)
    } catch (error) {
        console.error('Fetch failed (Monetary Policy Data). Error:', error);
        return 'Could not retrieve information from the Monetary Policy Data at this time.';
    }
}

export default getMonetaryPolicyData;