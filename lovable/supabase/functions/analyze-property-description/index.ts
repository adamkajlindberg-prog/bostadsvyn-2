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
    const { propertyId, description, title } = await req.json();
    console.log("Analyzing property description:", propertyId);

    if (!description || description.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Description is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI to analyze the property description
    const aiResponse = await fetch(
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
            {
              role: "system",
              content: `Du är en AI som analyserar fastighetsannonser på svenska. Din uppgift är att extrahera strukturerad metadata från beskrivningen.

Extrahera följande information:
- features: Array av features som finns i bostaden (balcony, parking, elevator, outdoorSpace, petFriendly, smartHome, nearSchools, nearPublicTransport, renovated, newConstruction, waterView, oceanView, skylight, fireplace, sauna, pool, gym, storage, garage, terrace, garden, modernKitchen, newBathroom, walkInCloset, etc.)
- keywords: Array av viktiga sökord och nyckelfraser som beskriver bostaden
- summary: En kort sammanfattning (max 2 meningar) av bostadens främsta fördelar och egenskaper
- condition: Skick på bostaden (excellent, good, fair, renovation_needed)
- style: Stil på bostaden (modern, classic, minimalist, rustic, etc.)
- highlights: Array av 3-5 huvudsakliga säljande punkter

Svara ENDAST med giltig JSON. Använd engelska för feature-namn men svenska för summary och highlights.`,
            },
            {
              role: "user",
              content: `Titel: ${title || "Ingen titel"}\n\nBeskrivning:\n${description}`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "extract_property_metadata",
                description:
                  "Extract structured metadata from property description",
                parameters: {
                  type: "object",
                  properties: {
                    features: {
                      type: "array",
                      items: { type: "string" },
                      description: "Array of property features in English",
                    },
                    keywords: {
                      type: "array",
                      items: { type: "string" },
                      description: "Important search keywords in Swedish",
                    },
                    summary: {
                      type: "string",
                      description: "Brief summary in Swedish (max 2 sentences)",
                    },
                    condition: {
                      type: "string",
                      enum: ["excellent", "good", "fair", "renovation_needed"],
                      description: "Overall condition of the property",
                    },
                    style: {
                      type: "string",
                      description: "Architectural/interior style",
                    },
                    highlights: {
                      type: "array",
                      items: { type: "string" },
                      description: "3-5 main selling points in Swedish",
                    },
                  },
                  required: ["features", "keywords", "summary"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "extract_property_metadata" },
          },
        }),
      },
    );

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({
            error: "AI credits exhausted. Please add funds to continue.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI analysis response:", JSON.stringify(aiData, null, 2));

    // Extract the tool call result
    let metadata = {
      features: [],
      keywords: [],
      summary: "",
      condition: null,
      style: null,
      highlights: [],
    };

    if (aiData.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments) {
      const args = aiData.choices[0].message.tool_calls[0].function.arguments;
      metadata = typeof args === "string" ? JSON.parse(args) : args;
    }

    console.log("Extracted metadata:", metadata);

    // Update the property with AI-extracted metadata
    if (propertyId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: updateError } = await supabase
        .from("properties")
        .update({
          ai_extracted_features: metadata.features,
          ai_keywords: metadata.keywords,
          ai_description_summary: metadata.summary,
          ai_analyzed_at: new Date().toISOString(),
        })
        .eq("id", propertyId);

      if (updateError) {
        console.error("Error updating property:", updateError);
        throw updateError;
      }

      console.log(`Property ${propertyId} updated with AI metadata`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        metadata,
        message: "Property description analyzed successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in analyze-property-description:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
