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
    const { batchSize = 10, onlyUnanalyzed = true } = await req.json();
    console.log(
      `Starting batch analysis. Batch size: ${batchSize}, Only unanalyzed: ${onlyUnanalyzed}`,
    );

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch properties to analyze
    let query = supabase
      .from("properties")
      .select("id, title, description")
      .not("description", "is", null)
      .eq("status", "active");

    if (onlyUnanalyzed) {
      query = query.is("ai_analyzed_at", null);
    }

    const { data: properties, error: fetchError } =
      await query.limit(batchSize);

    if (fetchError) {
      console.error("Error fetching properties:", fetchError);
      throw fetchError;
    }

    if (!properties || properties.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          analyzed: 0,
          message: "No properties found to analyze",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`Found ${properties.length} properties to analyze`);

    const results = {
      total: properties.length,
      successful: 0,
      failed: 0,
      errors: [],
    };

    // Analyze each property
    for (const property of properties) {
      try {
        console.log(`Analyzing property ${property.id}...`);

        const { error: analyzeError } = await supabase.functions.invoke(
          "analyze-property-description",
          {
            body: {
              propertyId: property.id,
              title: property.title,
              description: property.description,
            },
          },
        );

        if (analyzeError) {
          console.error(
            `Error analyzing property ${property.id}:`,
            analyzeError,
          );
          results.failed++;
          results.errors.push({
            propertyId: property.id,
            error: analyzeError.message,
          });
        } else {
          console.log(`Successfully analyzed property ${property.id}`);
          results.successful++;
        }

        // Small delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Exception analyzing property ${property.id}:`, error);
        results.failed++;
        results.errors.push({
          propertyId: property.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    console.log(
      `Batch analysis complete. Successful: ${results.successful}, Failed: ${results.failed}`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        ...results,
        message: `Analyzed ${results.successful} out of ${results.total} properties`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in batch-analyze-properties:", error);
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
