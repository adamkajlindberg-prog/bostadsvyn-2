import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log("Natural language search query:", query);

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI to interpret the natural language query
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Du är en AI-assistent som tolkar bostadssökningar på svenska med EXTREM PRECISION och DETALJRIKEDOM. Din uppgift är att extrahera strukturerad data från användarens naturliga språkbeskrivning och förstå ALLA vanliga ord och fraser som används i objektsbeskrivningar.

KRITISKA REGLER FÖR PRISER:
- "upp till X miljoner" = ENDAST maxPrice: X000000 (INTE minPrice!)
- "under X miljoner" = ENDAST maxPrice: X000000 (INTE minPrice!)
- "max X miljoner" = ENDAST maxPrice: X000000
- "från X till Y miljoner" = minPrice: X000000 OCH maxPrice: Y000000
- "mellan X och Y miljoner" = minPrice: X000000 OCH maxPrice: Y000000
- "minst X miljoner" = ENDAST minPrice: X000000 (INTE maxPrice!)
- "över X miljoner" = ENDAST minPrice: X000000
- "ca X miljoner" = minPrice: (X-0.5)*1000000, maxPrice: (X+0.5)*1000000

EXEMPEL PÅ KORREKT TOLKNING:
- "Lägenhet i Stockholm upp till 5 miljoner" → maxPrice: 5000000 (INTE minPrice!)
- "Villa under 8 miljoner" → maxPrice: 8000000
- "Hus från 3 till 6 miljoner" → minPrice: 3000000, maxPrice: 6000000
- "Radhus minst 4 miljoner" → minPrice: 4000000 (INTE maxPrice!)

KRITISKA REGLER FÖR STORLEK OCH RUM:
- "upp till X rum" = ENDAST maxRooms: X (INTE minRooms!)
- "minst X rum" = ENDAST minRooms: X (INTE maxRooms!)
- "max X kvm" = ENDAST maxArea: X
- "minst X kvm" = ENDAST minArea: X

DIN UPPGIFT ÄR ATT FÖRSTÅ OCH EXTRAHERA ALLA VANLIGA ORD OCH FRASER FRÅN OBJEKTSBESKRIVNINGAR:

STILAR & KARAKTÄR: moderna, klassisk, tidlös, charmig, ljus, rymlig, trivsam, mysig, elegant, exklusiv, ståtlig, påkostad, anrik, autentisk, renoverad, fräsch, välplanerad, genomtänkt, funktionell

LÄGE & OMGIVNING: central, lugnt, naturnära, havsnära, sjönära, stadsnära, landsbygd, villaområde, barnvänligt, eftertraktat, attraktivt, populärt, etablerat, gångavstånd, nära affärer, nära kommunikationer

BYGGNADSDETALJER: puts, tegel, trä, sten, plåt, burspråk, takfönster, högt i tak, ljusinsläpp, fönster åt flera väderstreck, genomgående, inglasad, uterum, vinterträdgård, friggebod, bod, uthus

EXTERIÖR & TOMT: altan, uteplats, trädgård, gräsmatta, rabatter, odlingslotter, planteringar, fruktträd, bärbuskar, stenlagd, terrass, pool, brygga, egen strand, skogstomt, sluttande, flat, inhägnad, carport, uppfart

INTERIÖR: öppen planlösning, genomgående, generöst, högt i tak, trägolv, parkett, klinker, kakel, stuckatur, takrosett, spaljédörrar, panel, helkaklat badrum, dusch, badkar, tvättmaskin, torktumlare, diskmaskin, vitvaror

VÄRME & ENERGI: fjärrvärme, bergvärme, pellets, ved, luftvärmepump, vattenburen värme, elradiatorer, golvvärme, energiklass, isolering, fönsterbyte, solceller

ÖVRIG STANDARD: renoverad, fräsch, ombyggd, tillbyggd, totalrenoverad, nyrenoverad, ursprunglig, i orginalskick, välvårdad, påkostad, upprustningsbehov, renoveringsobjekt, utvecklingspotential

Extrahera följande information:
- location: Stad, område, gata, kommun eller län (string)
- propertyType: house, apartment, townhouse, cottage, plot, farm, commercial, rental (array)
- minRooms: Minsta antal rum - använd ENDAST för "minst", "från" eller "över" (number)
- maxRooms: Maximalt antal rum - använd ENDAST för "max", "upp till" eller "under" (number)
- minArea: Minsta boarea i kvm - använd ENDAST för "minst", "från" eller "över" (number)
- maxArea: Maximal boarea i kvm - använd ENDAST för "max", "upp till" eller "under" (number)
- minPrice: Minimipris - använd ENDAST för "minst", "från" eller "över" (number)
- maxPrice: Maxpris - använd ENDAST för "max", "upp till" eller "under" (number)
- features: Egenskaper och ord från beskrivningar (array)
- minBedrooms: Minsta antal sovrum (number)
- minBathrooms: Minsta antal badrum (number)
- keywords: ALLA stilar, karaktärsdrag och beskrivande ord som användaren nämner (string med kommaseparerade ord)

VAR EXTREMT NOGGRANN med min/max-värden! Tolka språket EXAKT som det står! EXTRAHERA ALLA BESKRIVANDE ORD till keywords!`
          },
          {
            role: "user",
            content: query
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_search_criteria",
              description: "Extract structured property search criteria from natural language",
              parameters: {
                type: "object",
                properties: {
                  location: { type: "string", description: "Location (city, area, street, municipality)" },
                  propertyType: {
                    type: "array",
                    items: {
                      type: "string",
                      enum: ["house", "apartment", "townhouse", "cottage", "plot", "farm", "commercial", "rental", "other"]
                    },
                    description: "Type of property"
                  },
                  minRooms: { type: "number", description: "Minimum number of rooms" },
                  maxRooms: { type: "number", description: "Maximum number of rooms" },
                  minArea: { type: "number", description: "Minimum living area in sqm" },
                  maxArea: { type: "number", description: "Maximum living area in sqm" },
                  minPrice: { type: "number", description: "Minimum price" },
                  maxPrice: { type: "number", description: "Maximum price" },
                  features: {
                    type: "array",
                    items: {
                      type: "string",
                      enum: [
                        "balcony", "terrace", "pool", "outdoorSpace", "parking", "elevator", "garage", "storage",
                        "fireplace", "woodStove", "tileStove", "sauna",
                        "enclosedBalcony", "openFloorPlan",
                        "petFriendly", "smartHome", "nearSchools", "nearPreschool", "nearPublicTransport",
                        "newlyRenovated", "manorStyle", "centuryOld", "largePlot", "seaView", "lakeView",
                        "garden", "winterGarden", "walkInCloset", "laundryRoom",
                        "woodenFloor", "parquetFloor", "renovationProject",
                        "bright", "spacious", "charming", "modern", "classic", "elegant", "cozy",
                        "central", "quiet", "natureClose", "seaClose", "lakeClose", "cityClose",
                        "familyFriendly", "accessible", "walkingDistance",
                        "brick", "wood", "stone", "bayWindow", "skylight", "highCeilings",
                        "garden", "lawn", "plantings", "fruitTrees", "dock", "privateBeach",
                        "heatedFloors", "districtHeating", "geothermalHeating", "solarPanels",
                        "dishwasher", "washingMachine", "dryer", "whiteGoods",
                        "renovated", "wellMaintained", "originalCondition", "developmentPotential"
                      ]
                    },
                    description: "Desired property features and characteristics"
                  },
                  minBedrooms: { type: "number", description: "Minimum number of bedrooms" },
                  minBathrooms: { type: "number", description: "Minimum number of bathrooms" },
                  keywords: { type: "string", description: "Other keywords" }
                },
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_search_criteria" } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response:", JSON.stringify(aiData, null, 2));

    // Extract the tool call result
    let searchCriteria = {};
    if (aiData.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments) {
      const args = aiData.choices[0].message.tool_calls[0].function.arguments;
      searchCriteria = typeof args === "string" ? JSON.parse(args) : args;
    }

    console.log("Extracted search criteria:", searchCriteria);

    // Now search properties using the extracted criteria
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query_builder = supabase
      .from("properties")
      .select("*")
      .eq("status", "active");

    // Apply filters based on extracted criteria
    if (searchCriteria.location) {
      const location = searchCriteria.location.toLowerCase();
      query_builder = query_builder.or(
        `address_city.ilike.%${location}%,address_street.ilike.%${location}%,address_postal_code.ilike.%${location}%,address_region.ilike.%${location}%,address_municipality.ilike.%${location}%`
      );
    }

    if (searchCriteria.propertyType && searchCriteria.propertyType.length > 0) {
      query_builder = query_builder.in("property_type", searchCriteria.propertyType);
    }

    if (searchCriteria.minRooms) {
      query_builder = query_builder.gte("rooms", searchCriteria.minRooms);
    }

    if (searchCriteria.maxRooms) {
      query_builder = query_builder.lte("rooms", searchCriteria.maxRooms);
    }

    if (searchCriteria.minArea) {
      query_builder = query_builder.gte("living_area", searchCriteria.minArea);
    }

    if (searchCriteria.maxArea) {
      query_builder = query_builder.lte("living_area", searchCriteria.maxArea);
    }

    if (searchCriteria.minPrice) {
      query_builder = query_builder.gte("price", searchCriteria.minPrice);
    }

    if (searchCriteria.maxPrice) {
      query_builder = query_builder.lte("price", searchCriteria.maxPrice);
    }

    // Apply feature filters using features array and AI-extracted features
    if (searchCriteria.features && searchCriteria.features.length > 0) {
      // Map feature names to Swedish equivalents used in the features array
      const featureMapping: Record<string, string> = {
        "balcony": "Balkong",
        "terrace": "Terrass",
        "pool": "Pool",
        "outdoorSpace": "Uteplats",
        "parking": "Parkering",
        "elevator": "Hiss",
        "garage": "Garage",
        "storage": "Förråd",
        "fireplace": "Öppen spis",
        "woodStove": "Vedugn",
        "tileStove": "Kakelugn",
        "sauna": "Bastu",
        "enclosedBalcony": "Inglasad balkong",
        "openFloorPlan": "Öppen planlösning",
        "petFriendly": "Husdjur tillåtna",
        "smartHome": "Smart hem",
        "nearSchools": "Nära skolor",
        "nearPreschool": "Nära förskola",
        "nearPublicTransport": "Nära kollektivtrafik",
        "newlyRenovated": "Nyrenoverad",
        "manorStyle": "Herrgårdsstil",
        "centuryOld": "Sekelskifte",
        "largePlot": "Stor tomt",
        "seaView": "Havsutsikt",
        "lakeView": "Sjöutsikt",
        "garden": "Trädgård",
        "winterGarden": "Vinterträdgård",
        "walkInCloset": "Walk-in closet",
        "laundryRoom": "Tvättstuga",
        "woodenFloor": "Trägolv",
        "parquetFloor": "Parkett",
        "renovationProject": "Renoveringsobjekt"
      };

      // Build OR conditions to search in both features array and AI-extracted features
      const orConditions: string[] = [];
      
      for (const feature of searchCriteria.features) {
        const swedishFeature = featureMapping[feature] || feature;
        // Search in features array
        orConditions.push(`features.cs.{${swedishFeature}}`);
        // Also search in AI-extracted features
        orConditions.push(`ai_extracted_features.cs.{${feature}}`);
        // Search in description as well
        orConditions.push(`description.ilike.%${swedishFeature}%`);
      }

      if (orConditions.length > 0) {
        query_builder = query_builder.or(orConditions.join(','));
      }
    }

    // Search in AI keywords and description if search has keywords
    if (searchCriteria.keywords) {
      const keywordList = searchCriteria.keywords.toLowerCase().split(',').map(k => k.trim());
      const keywordConditions: string[] = [];
      
      for (const keyword of keywordList) {
        if (keyword.length > 0) {
          keywordConditions.push(`description.ilike.%${keyword}%`);
          keywordConditions.push(`title.ilike.%${keyword}%`);
          keywordConditions.push(`ai_keywords.cs.{${keyword}}`);
        }
      }
      
      if (keywordConditions.length > 0) {
        query_builder = query_builder.or(keywordConditions.join(','));
      }
    }

    const { data: properties, error: dbError } = await query_builder.limit(50);

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    console.log(`Found ${properties?.length || 0} matching properties`);

    return new Response(
      JSON.stringify({
        success: true,
        searchCriteria,
        properties: properties || [],
        count: properties?.length || 0,
        message: properties?.length 
          ? `Hittade ${properties.length} bostäder som matchar dina önskemål`
          : "Inga bostäder hittades som matchar dina kriterier. Prova att justera din sökning."
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in ai-natural-search:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
