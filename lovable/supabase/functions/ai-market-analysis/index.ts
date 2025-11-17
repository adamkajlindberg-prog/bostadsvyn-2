import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MarketData {
  area: string;
  propertyType: string;
  timeframe: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting market analysis request");

    const { marketData } = (await req.json()) as { marketData: MarketData };

    if (!marketData || !marketData.area || !marketData.propertyType) {
      throw new Error("Market data with area and property type is required");
    }

    console.log("Market data received:", marketData);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get historical sales data from the area
    const { data: salesHistory, error: salesError } = await supabase
      .from("property_sales_history")
      .select("*")
      .ilike("location", `%${marketData.area}%`)
      .eq("property_type", marketData.propertyType.toLowerCase())
      .gte(
        "sale_date",
        new Date(
          Date.now() -
            parseInt(marketData.timeframe, 10) * 30 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
      )
      .order("sale_date", { ascending: false })
      .limit(100);

    if (salesError) {
      console.error("Error fetching sales history:", salesError);
    }

    // Get market analytics
    const { data: marketAnalytics, error: marketError } = await supabase
      .from("market_analytics")
      .select("*")
      .ilike("region", `%${marketData.area}%`)
      .eq("property_type", marketData.propertyType.toLowerCase())
      .order("period_start", { ascending: false })
      .limit(24);

    if (marketError) {
      console.error("Error fetching market analytics:", marketError);
    }

    // Create AI prompt for market analysis
    const prompt = `
Som en professionell fastighetsmarknadsanalytiker, analysera följande marknad och ge en omfattande analys:

Marknadsdata:
- Område: ${marketData.area}
- Fastighetstyp: ${marketData.propertyType}
- Tidsperiod: ${marketData.timeframe} månader

Tillgänglig data:
${salesHistory ? `Försäljningshistorik: ${salesHistory.length} transaktioner` : "Begränsad försäljningsdata"}
${marketAnalytics ? `Marknadsanalys: ${marketAnalytics.length} datapunkter` : "Begränsad marknadsdata"}

Ge en detaljerad JSON-analys med:
1. Prisutveckling (priceData): Array med månadsdata inklusive avgPrice, medianPrice, pricePerSqm, salesVolume
2. Marknadstrend (marketTrend): direction (up/down/stable), percentage, description
3. Efterfrågan/Utbud (demandSupply): demand, supply, ratio, status (sellers_market/buyers_market/balanced)
4. Genomsnittlig tid på marknaden (averageDaysOnMarket): antal dagar
5. Hotspots: Array med områden med stark tillväxt (area, growthRate, avgPrice, trend)
6. Prognoser (predictions): next3Months, next6Months, next12Months (procent), confidence (0-100)
7. Insikter (insights): Array med type (opportunity/warning/info), title, description

Överväganden:
- Historiska pristrender och försäljningsvolymer
- Säsongsvariation
- Ekonomiska indikatorer
- Lokala utvecklingsprojekt
- Infrastruktur och tillgänglighet
- Demografiska trender
- Utbud vs efterfrågan

Formatera svaret som giltig JSON med svenska beskrivningar. Var specifik och basera analysen på realistiska marknadsförhållanden för ${marketData.area}.
`;

    console.log("Sending request to OpenAI API");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Du är en professionell svensk fastighetsmarknadsanalytiker med expertis i marknadsanalyser och pristrender. Svara alltid på svenska och ge noggranna, detaljerade analyser baserade på aktuella marknadsförhållanden.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("OpenAI API response received");

    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      // Fallback to default structure if parsing fails
      aiAnalysis = {
        error: "Could not parse AI analysis response",
        rawResponse: data.choices[0].message.content,
      };
    }

    // Log the analysis request for analytics
    const { error: logError } = await supabase
      .from("ai_editor_analytics")
      .insert({
        action_type: "market_analysis",
        success: true,
        processing_time_ms: Date.now() - Date.now(),
        ai_model_used: "gpt-4o-mini",
        user_id: null,
        session_id: crypto.randomUUID(),
      });

    if (logError) {
      console.error("Error logging analytics:", logError);
    }

    console.log("Market analysis completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        analysis: aiAnalysis,
        marketData: marketAnalytics || [],
        salesHistory: salesHistory || [],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in market analysis function:", error);

    // Log the error for analytics
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase.from("ai_editor_analytics").insert({
          action_type: "market_analysis",
          success: false,
          error_message: (error as Error).message,
          processing_time_ms: Date.now() - Date.now(),
          ai_model_used: "gpt-4o-mini",
          user_id: null,
          session_id: crypto.randomUUID(),
        });
      } catch (logError) {
        console.error("Error logging analytics:", logError);
      }
    }

    return new Response(
      JSON.stringify({
        error: (error as Error).message,
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
