import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's search history (last 10 searches)
    const { data: searchHistory, error: historyError } = await supabase
      .from("user_search_history")
      .select(
        "search_query, search_filters, property_type, price_range, location",
      )
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (historyError) {
      console.error("Error fetching search history:", historyError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch search history" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!searchHistory || searchHistory.length === 0) {
      return new Response(
        JSON.stringify({
          recommendations: [],
          message:
            "Inga sökningar ännu - börja söka för att få AI-rekommendationer!",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Analyze search patterns with AI
    const searchPattern = searchHistory.map((search) => ({
      query: search.search_query,
      type: search.property_type,
      price: search.price_range,
      location: search.location,
      filters: search.search_filters,
    }));

    const prompt = `Analysera denna användares sökhistorik för fastigheter och generera en databassökning för att hitta matchande nya fastigheter:

Sökhistorik: ${JSON.stringify(searchPattern)}

Baserat på mönstren, skapa en JSON-struktur med rekommenderade sökkriterier som skulle kunna matcha användarens intressen. Fokusera på:
1. Vanligaste fastighetstypen
2. Prisintervall (medel av sökningarna)  
3. Föredragna områden/städer
4. Vanliga filter/egenskaper

Svara endast med JSON i detta format:
{
  "property_types": ["typ1", "typ2"],
  "price_range": {"min": 0, "max": 10000000},
  "locations": ["stad1", "stad2"],
  "features": ["feature1", "feature2"],
  "confidence": 0.8
}`;

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
              "Du är en AI-assistent som analyserar fastighetsönskemål och skapar databassökningar. Svara endast med valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    const aiResponse = await response.json();
    const aiAnalysis = JSON.parse(aiResponse.choices[0].message.content);

    // Build database query based on AI analysis
    let query = supabase
      .from("properties")
      .select("*")
      .in("status", ["FOR_SALE", "FOR_RENT", "COMING_SOON"]);

    // Apply AI-recommended filters
    if (aiAnalysis.property_types && aiAnalysis.property_types.length > 0) {
      query = query.in("property_type", aiAnalysis.property_types);
    }

    if (aiAnalysis.price_range) {
      query = query
        .gte("price", aiAnalysis.price_range.min)
        .lte("price", aiAnalysis.price_range.max);
    }

    // Location filter
    if (aiAnalysis.locations && aiAnalysis.locations.length > 0) {
      const locationFilter = aiAnalysis.locations
        .map((loc: string) => `address_city.ilike.%${loc}%`)
        .join(",");
      query = query.or(locationFilter);
    }

    // Get recent properties that match AI analysis
    query = query.order("created_at", { ascending: false }).limit(6);

    const { data: recommendations, error: recError } = await query;

    if (recError) {
      console.error("Error fetching recommendations:", recError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch recommendations" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        recommendations: recommendations || [],
        analysis: aiAnalysis,
        message: `Hittade ${recommendations?.length || 0} rekommendationer baserat på dina tidigare sökningar`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in ai-property-recommendations function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
