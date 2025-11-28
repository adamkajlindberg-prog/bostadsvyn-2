import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationRequest {
  title: string;
  description: string;
  imageUrls: string[];
  hasAIEditedImages?: boolean;
  markedAsPhotomontage?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      title, 
      description, 
      imageUrls, 
      hasAIEditedImages = false,
      markedAsPhotomontage = false 
    }: VerificationRequest = await req.json();

    console.log('Verifying rental content:', { 
      title, 
      description, 
      imageCount: imageUrls.length,
      hasAIEditedImages,
      markedAsPhotomontage
    });

    // Step 1: Verify text content for legal compliance
    const textVerificationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Du är en AI-moderator som granskar hyresannonser enligt svensk lag och Fastighetsmäklarinspektionens (FMI) riktlinjer.

REGLER ENLIGT SVENSK LAG:
1. Marknadsföringslagen (2008:486) - Allt måste vara sanningsenligt och inte vilseledande
2. Diskrimineringslagen (2008:567) - Ingen diskriminering baserat på:
   - Kön, könsidentitet eller könsuttryck
   - Etnisk tillhörighet, religion eller trosuppfattning
   - Funktionsnedsättning
   - Sexuell läggning
   - Ålder
   - Familjesituation (barn, gravid)
   - Nationalitet eller ursprung

FMI:s KRAV FÖR HYRESANNONSER:
- Alla uppgifter måste vara korrekta (storlek, rum, avgift, hyra)
- Inget får döljas eller framställas vilseledande
- Brister och problem får inte undanhållas
- Alla väsentliga villkor måste framgå tydligt

GODKÄNN OM:
✓ Språket är professionellt, neutralt och respektfullt
✓ Beskrivningen är objektiv och faktabaserad
✓ Inga krav eller preferenser som kan vara diskriminerande
✓ Fullständig information om hyra, depositioner, avgifter
✓ Tydlig information om lägenhetens skick
✓ Inga tecken på bedrägeri eller bluff

AVVISA OM (och förklara varför):
✗ Diskriminerande språk eller krav (t.ex. "inga utlänningar", "endast svenska", "inga barn", "par utan barn föredras")
✗ Könsbundna krav (t.ex. "kvinna sökes", "manlig hyresgäst")
✗ Åldersdiskriminering (t.ex. "endast unga", "pensionärer ej aktuella")
✗ Religiösa krav eller preferenser
✗ Vilseledande information om storlek, pris eller läge
✗ Dolda avgifter eller oklara villkor
✗ Vulgärt eller olämpligt språk
✗ Tecken på bedrägeri (t.ex. ovanligt lågt pris, krav på förskottsbetalning utanför Sverige)
✗ Olagliga villkor eller aktiviteter

EXEMPEL PÅ OTILLÅTNA FORMULERINGAR:
- "Lugn hyresgäst utan barn" → Diskriminerar familjer
- "Svenska som modersmål krävs" → Etnisk diskriminering
- "Passar bäst för par" → Könsdiskriminering
- "Endast icke-rökare" → OK (rökning är inte skyddad)
- "Husdjur ej tillåtna" → OK (husdjur är inte skyddade, men assistanshundar måste tillåtas)

Svara ENDAST med JSON i detta format:
{"approved": true/false, "reason": "detaljerad förklaring på svenska om varför innehållet godkänns eller avvisas", "violations": ["lista över specifika överträdelser om några"]}`
          },
          {
            role: 'user',
            content: `Titel: "${title}"\n\nBeskrivning: "${description}"`
          }
        ],
        temperature: 0.2,
        max_tokens: 500,
      }),
    });

    if (!textVerificationResponse.ok) {
      if (textVerificationResponse.status === 429) {
        return new Response(JSON.stringify({
          approved: false,
          reason: 'AI-verifieringstjänsten är överbelastad. Försök igen om en stund.'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (textVerificationResponse.status === 402) {
        return new Response(JSON.stringify({
          approved: false,
          reason: 'AI-verifieringstjänsten är tillfälligt otillgänglig. Kontakta support.'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${textVerificationResponse.status}`);
    }

    const textVerificationData = await textVerificationResponse.json();
    console.log('Text verification response:', textVerificationData);

    let textResult;
    try {
      const content = textVerificationData.choices[0].message.content;
      // Handle both JSON and plain text responses
      textResult = content.includes('{') ? JSON.parse(content) : { approved: false, reason: content };
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      textResult = { approved: false, reason: 'Kunde inte verifiera innehållet. Försök igen.' };
    }

    if (!textResult.approved) {
      return new Response(JSON.stringify({
        approved: false,
        reason: textResult.reason,
        violations: textResult.violations || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 2: Check if AI-edited images are properly marked
    if (hasAIEditedImages && !markedAsPhotomontage) {
      return new Response(JSON.stringify({
        approved: false,
        reason: 'AI-redigerade bilder måste märkas som fotomontage enligt FMI:s riktlinjer. Markera detta i din annons.',
        violations: ['FMI_IMAGE_LABELING_REQUIRED']
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 3: Verify images if provided (multimodal check)
    if (imageUrls.length > 0) {
      console.log('Verifying images with AI...');
      
      // Check up to 3 images with multimodal AI
      const imagesToCheck = imageUrls.slice(0, 3);
      
      for (let i = 0; i < imagesToCheck.length; i++) {
        const imageUrl = imagesToCheck[i];
        
        // Only check if it's a data URL or accessible URL
        if (!imageUrl.startsWith('data:image/') && !imageUrl.startsWith('http')) {
          continue;
        }

        try {
          const imageVerificationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                {
                  role: 'system',
                  content: `Du granskar bilder i hyresannonser. Kontrollera om bilden är lämplig för publicering.

GODKÄNN OM:
✓ Bilden visar fastigheten/lägenheten
✓ Bilden är professionell och respektfull
✓ Bilden är relevant för hyresannons

AVVISA OM:
✗ Olämpligt innehåll (nakenhet, våld, etc.)
✗ Irrelevant innehåll som inte har med bostaden att göra
✗ Stötande eller diskriminerande symboler
✗ Uppenbart vilseledande (fel objekt)

Svara ENDAST med JSON: {"approved": true/false, "reason": "förklaring på svenska"}`
                },
                {
                  role: 'user',
                  content: [
                    {
                      type: 'text',
                      text: 'Granska denna bild från en hyresannons:'
                    },
                    {
                      type: 'image_url',
                      image_url: {
                        url: imageUrl
                      }
                    }
                  ]
                }
              ],
              temperature: 0.2,
              max_tokens: 300,
            }),
          });

          if (imageVerificationResponse.ok) {
            const imageVerificationData = await imageVerificationResponse.json();
            const imageContent = imageVerificationData.choices[0].message.content;
            
            let imageResult;
            try {
              imageResult = imageContent.includes('{') ? JSON.parse(imageContent) : { approved: true };
            } catch {
              imageResult = { approved: true }; // Default to approved if can't parse
            }

            if (!imageResult.approved) {
              return new Response(JSON.stringify({
                approved: false,
                reason: `Bild ${i + 1}: ${imageResult.reason}`,
                violations: ['INAPPROPRIATE_IMAGE']
              }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            }
          }
        } catch (imageError) {
          console.error(`Error verifying image ${i}:`, imageError);
          // Continue checking other images even if one fails
        }
      }
    }

    console.log('Content verification passed - all checks OK');

    return new Response(JSON.stringify({
      approved: true,
      reason: 'Innehållet har godkänts. Annonsen följer svensk lag och FMI:s riktlinjer.',
      violations: []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in verify-rental-content function:', error);
    return new Response(JSON.stringify({ 
      approved: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});