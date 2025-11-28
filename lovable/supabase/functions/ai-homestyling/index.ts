import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HomestylingRequest {
  image: string;
  prompt: string;
  style: string;
  room: string;
  intensity: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, prompt, style, room, intensity }: HomestylingRequest = await req.json();
    
    console.log('Processing homestyling request:', { style, room, intensity });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create detailed prompt for homestyling
    const detailedPrompt = `Interior design transformation: ${prompt}

Style guidelines for ${style}:
- Scandinavian: Light colors, natural materials, minimalist furniture, hygge atmosphere
- Modern: Clean lines, neutral colors, geometric shapes, contemporary furniture
- Bohemian: Rich colors, mixed patterns, eclectic furniture, artistic elements
- Industrial: Raw materials, dark colors, metal fixtures, exposed elements
- Luxury: Premium materials, elegant furniture, sophisticated color palette
- Cozy: Warm colors, soft textures, comfortable furniture, intimate lighting

Room type: ${room}
Transformation intensity: ${Math.round(intensity * 100)}%

Important: Maintain the room's basic structure and proportions while updating:
- Furniture style and arrangement
- Color scheme and materials  
- Lighting and ambiance
- Decorative elements and accessories
- Wall treatments and finishes

Create a realistic, professionally styled interior that homebuyers would find appealing.`;

    // Call OpenAI DALL-E for image editing
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: image.split(',')[1], // Remove data URL prefix
        prompt: detailedPrompt,
        n: 1,
        size: "1024x1024",
        response_format: "url"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      throw new Error('No image generated');
    }

    const imageUrl = data.data[0].url;
    
    console.log('Homestyling completed successfully');

    return new Response(JSON.stringify({ 
      image_url: imageUrl,
      style,
      room,
      prompt: detailedPrompt
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-homestyling function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'Failed to process homestyling request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});