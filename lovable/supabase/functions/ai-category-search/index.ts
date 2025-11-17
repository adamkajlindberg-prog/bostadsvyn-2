import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create category-specific system prompts
    const categoryPrompts = {
      rental: `Du är en AI-assistent som hjälper användare att söka efter hyresbostäder. Fokusera på hyresmarknaden och extrahera relevant information för hyresbostäder. Om användaren söker efter något som inte passar hyra, hitta ändå liknande hyresobjekt baserat på andra kriterier.`,
      nyproduktion: `Du är en AI-assistent som hjälper användare att söka efter nyproduktionsprojekt. Fokusera på nybyggda bostäder och kommande projekt. Om användaren söker efter något som inte är nyproduktion, hitta ändå liknande nyproduktionsobjekt baserat på andra kriterier.`,
      fritid: `Du är en AI-assistent som hjälper användare att söka efter fritidshus och tomter. Fokusera på fritidsboenden, sommarstugor och fritidstomter. Om användaren söker efter något som inte passar fritid, hitta ändå liknande fritidsobjekt baserat på andra kriterier.`,
      kommersiell: `Du är en AI-assistent som hjälper användare att söka efter kommersiella fastigheter. Fokusera på kontor, butiker, lager och industrilokaler. Om användaren söker efter något som inte är kommersiellt, hitta ändå liknande kommersiella objekt baserat på andra kriterier.`,
    };

    const systemPrompt = `${categoryPrompts[category as keyof typeof categoryPrompts]}

Din uppgift är att analysera användarens naturliga språkbeskrivning och extrahera strukturerad sökdata med EXTREM NOGGRANNHET och DETALJRIKEDOM. Du ska förstå och extrahera ALLA vanliga ord och fraser som används i objektsbeskrivningar.

VIKTIGA KATEGORIER AV ORD ATT KÄNNA IGEN:

STILAR & KARAKTÄR: moderna, klassisk, tidlös, charmig, ljus, rymlig, trivsam, mysig, elegant, exklusiv, ståtlig, påkostad, anrik, autentisk, renoverad, fräsch, välplanerad, genomtänkt, funktionell

LÄGE & OMGIVNING: central, lugnt, naturnära, havsnära, sjönära, stadsnära, landsbygd, villaområde, barnvänligt, eftertraktat, attraktivt, populärt, etablerat, gångavstånd, nära affärer, nära kommunikationer

BYGGNADSDETALJER: puts, tegel, trä, sten, plåt, burspråk, takfönster, högt i tak, ljusinsläpp, fönster åt flera väderstreck, genomgående, inglasad, uterum, vinterträdgård, friggebod, bod, uthus

EXTERIÖR & TOMT: altan, uteplats, trädgård, gräsmatta, rabatter, odlingslotter, planteringar, fruktträd, bärbuskar, stenlagd, terrass, pool, brygga, egen strand, skogstomt, sluttande, flat, inhägnad, carport, uppfart

INTERIÖR: öppen planlösning, genomgående, generöst, högt i tak, trägolv, parkett, klinker, kakel, stuckatur, takrosett, spaljédörrar, panel, helkaklat badrum, dusch, badkar, tvättmaskin, torktumlare, diskmaskin, vitvaror

VÄRME & ENERGI: fjärrvärme, bergvärme, pellets, ved, luftvärmepump, vattenburen värme, elradiatorer, golvvärme, energiklass, isolering, fönsterbyte, solceller

ÖVRIG STANDARD: renoverad, fräsch, ombyggd, tillbyggd, totalrenoverad, nyrenoverad, ursprunglig, i orginalskick, välvårdad, påkostad, upprustningsbehov, renoveringsobjekt, utvecklingspotential

Extrahera följande information från användarens fråga:
- location (stad, kommun, område)
- propertyType (array med typer: Villa, Lägenhet, Radhus, Fritidshus, Tomt, Kommersiell, etc.)
- minRooms, maxRooms (antal rum)
- minArea, maxArea (boarea i kvm)
- minPrice, maxPrice (pris i kronor)
- minBedrooms (antal sovrum)
- minBathrooms (antal badrum)
- features (array: balcony, parking, elevator, outdoorSpace, etc.)
- keywords (ALLA beskrivande ord och fraser användaren nämner - kommaseparerade)

Viktig prioritering för kategori "${category}":
- Prioritera alltid objekt som matchar kategorin först
- Om inga exakta matchningar finns, föreslå liknande objekt inom kategorin
- Extrahera även kriterier som kan matcha andra objekt inom kategorin
- EXTRAHERA ALLA BESKRIVANDE ORD till keywords för att hitta exakta matchningar i objektsbeskrivningar

Exempel för kategori "rental":
Användarfråga: "Villa med 4 rum i Stockholm"
Din tolkning: Prioritera hyresvillor, men om inga finns, föreslå även hyresradhus eller större hyrelägenheter i Stockholm med minst 4 rum.

Svara ENDAST med ett JSON-objekt i följande format:
{
  "searchCriteria": {
    "location": "string eller null",
    "propertyType": ["Villa", "Lägenhet"] eller [],
    "minRooms": number eller null,
    "maxRooms": number eller null,
    "minArea": number eller null,
    "maxArea": number eller null,
    "minPrice": number eller null,
    "maxPrice": number eller null,
    "minBedrooms": number eller null,
    "minBathrooms": number eller null,
    "features": ["balcony", "parking"] eller [],
    "keywords": "string eller null"
  },
  "message": "En kortfattad bekräftelse på vad som tolkats",
  "categoryFocus": "${category}",
  "fallbackEnabled": true
}

Om något inte specificeras, använd null eller tom array.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "För många förfrågningar. Vänta en stund och försök igen.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error:
              "Tjänsten är tillfälligt otillgänglig. Kontakta support@bostadsvyn.se",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse the JSON response
    let parsedResponse;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      parsedResponse = JSON.parse(jsonString);
    } catch (_parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      throw new Error("Failed to parse AI response");
    }

    // Query database to get count
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query_builder = supabase
      .from("properties")
      .select("id", { count: "exact", head: true });

    const criteria = parsedResponse.searchCriteria;

    // Apply category-specific filters with fallback
    if (category === "rental") {
      query_builder = query_builder.eq("listing_type", "FOR_RENT");
    } else if (category === "nyproduktion") {
      query_builder = query_builder.or(
        "status.eq.COMING_SOON,is_new_construction.eq.true",
      );
    } else if (category === "fritid") {
      query_builder = query_builder.in("property_type", ["Fritidshus", "Tomt"]);
    } else if (category === "kommersiell") {
      query_builder = query_builder.eq("property_type", "Kommersiell");
    }

    // Apply location filter
    if (criteria.location) {
      query_builder = query_builder.or(
        `address_city.ilike.%${criteria.location}%,address_street.ilike.%${criteria.location}%,address_region.ilike.%${criteria.location}%,address_municipality.ilike.%${criteria.location}%,address_postal_code.ilike.%${criteria.location}%`,
      );
    }

    // Apply property type filter if specified
    if (criteria.propertyType && criteria.propertyType.length > 0) {
      query_builder = query_builder.in("property_type", criteria.propertyType);
    }

    // Apply other filters
    if (criteria.minRooms)
      query_builder = query_builder.gte("rooms", criteria.minRooms);
    if (criteria.maxRooms)
      query_builder = query_builder.lte("rooms", criteria.maxRooms);
    if (criteria.minArea)
      query_builder = query_builder.gte("living_area", criteria.minArea);
    if (criteria.maxArea)
      query_builder = query_builder.lte("living_area", criteria.maxArea);
    if (criteria.minPrice)
      query_builder = query_builder.gte("price", criteria.minPrice);
    if (criteria.maxPrice)
      query_builder = query_builder.lte("price", criteria.maxPrice);
    if (criteria.minBedrooms)
      query_builder = query_builder.gte("bedrooms", criteria.minBedrooms);
    if (criteria.minBathrooms)
      query_builder = query_builder.gte("bathrooms", criteria.minBathrooms);

    // Apply features filter
    if (criteria.features && criteria.features.length > 0) {
      const featureConditions: string[] = [];
      for (const feature of criteria.features) {
        featureConditions.push(`features.cs.{${feature}}`);
        featureConditions.push(`ai_extracted_features.cs.{${feature}}`);
        featureConditions.push(`description.ilike.%${feature}%`);
      }
      if (featureConditions.length > 0) {
        query_builder = query_builder.or(featureConditions.join(","));
      }
    }

    // Apply keywords filter to search in description and title
    if (criteria.keywords) {
      const keywordList = criteria.keywords
        .toLowerCase()
        .split(",")
        .map((k) => k.trim());
      const keywordConditions: string[] = [];

      for (const keyword of keywordList) {
        if (keyword.length > 0) {
          keywordConditions.push(`description.ilike.%${keyword}%`);
          keywordConditions.push(`title.ilike.%${keyword}%`);
          keywordConditions.push(`ai_keywords.cs.{${keyword}}`);
        }
      }

      if (keywordConditions.length > 0) {
        query_builder = query_builder.or(keywordConditions.join(","));
      }
    }

    const { count } = await query_builder;

    return new Response(
      JSON.stringify({
        ...parsedResponse,
        count: count || 0,
        category: category,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in ai-category-search:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Ett oväntat fel uppstod. Försök igen senare.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
