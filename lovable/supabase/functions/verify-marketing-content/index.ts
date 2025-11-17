import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { title, description, images, contentType } = await req.json();
    console.log("Verifying content:", {
      title,
      contentType,
      imageCount: images.length,
    });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Build messages for AI verification
    const messages = [
      {
        role: "system",
        content: `Du är en innehållsmoderator för en fastighetsplattform. Din uppgift är att verifiera marknadsföringsmaterial och säkerställa att:
1. Texten är professionell och inte innehåller olämpligt språk
2. Texten inte innehåller vilseledande påståenden
3. Bilderna verkar vara äkta fastighetsbilder och inte manipulerade
4. Innehållet följer svensk lag och god fastighetssed

Svara med JSON i formatet: { "approved": true/false, "reason": "förklaring" }`,
      },
      {
        role: "user",
        content: `Vänligen granska följande marknadsföringsmaterial:

Titel: ${title}
Beskrivning: ${description}
Innehållstyp: ${contentType === "video" ? "Marknadsföringsvideo" : "Enskilt inlägg"}
Antal bilder: ${images.length}

Är detta innehåll lämpligt för publicering?`,
      },
    ];

    // Call Lovable AI for text verification
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
          messages,
          temperature: 0.3,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI verification error:", response.status, errorText);
      throw new Error(`AI verification failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    console.log("AI verification response:", aiResponse);

    // Parse AI response
    let verification;
    try {
      verification = JSON.parse(aiResponse);
    } catch (_e) {
      // If AI didn't return valid JSON, try to extract approval
      verification = {
        approved:
          aiResponse.toLowerCase().includes("approved") ||
          aiResponse.toLowerCase().includes("godkänd"),
        reason: aiResponse,
      };
    }

    // Basic image validation (check if images are valid base64)
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!image.startsWith("data:image/")) {
        return new Response(
          JSON.stringify({
            approved: false,
            reason: `Bild ${i + 1} är inte giltig`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    return new Response(JSON.stringify(verification), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in verify-marketing-content:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Verification failed",
        approved: false,
        reason: "Ett tekniskt fel uppstod vid verifieringen",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
