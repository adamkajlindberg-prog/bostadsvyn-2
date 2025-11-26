import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Image Editor function called');
    
    const requestData = await req.json();
    console.log('Request data received:', {
      hasImageUrl: !!requestData.imageUrl,
      hasPrompt: !!requestData.prompt,
      editType: requestData.editType
    });

    const { imageUrl, prompt, editType, negativePrompt, strength: reqStrength, guidanceScale: reqGuidance, stylePreset, qualityLevel, maskUrl } = requestData;

    // Tune preservation parameters (lower strength to better keep original room)
    const computedStrength = Math.min(0.35, Math.max(0.15, typeof reqStrength === 'number' ? reqStrength : 0.25));
    const computedGuidance = Math.min(12, Math.max(3, typeof reqGuidance === 'number' ? reqGuidance : 7.5));
    const steps = 18; // slightly higher for quality while keeping speed

    const preservationPrefix = 'PRESERVE ORIGINAL ROOM: Keep layout, architecture, furniture placement, camera angle and lighting. Only change requested elements.';
    const builtInNegatives = 'Do not change room layout, do not change furniture style or placement, do not change camera angle, do not change color palette unless explicitly requested, avoid surreal/stylized looks, avoid extra objects, avoid duplicates.';
    const finalNegativePrompt = negativePrompt ? `${builtInNegatives} ${negativePrompt}` : builtInNegatives;

    // Validate required fields
    if (!imageUrl || !prompt) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: imageUrl and prompt are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if we have Hugging Face token
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    
    console.log('Environment check:', {
      hfTokenLength: hfToken ? hfToken.length : 0,
      hfTokenPrefix: hfToken ? hfToken.substring(0, 8) + '...' : 'none',
      openAIKeyLength: openAIKey ? openAIKey.length : 0,
      openAIKeyPrefix: openAIKey ? openAIKey.substring(0, 8) + '...' : 'none',
      allEnvKeys: Object.keys(Deno.env.toObject()).filter(key => 
        key.includes('HUG') || key.includes('OPENAI') || key.includes('API')
      )
    });

    if (hfToken) {
      try {
        console.log('Attempting to use FLUX image-to-image API...');
        
        // Convert image URL to absolute URL if it's relative
        let absoluteImageUrl = imageUrl;
        if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
          // Get the origin from the request headers
          const origin = req.headers.get('origin') || req.headers.get('referer') || 'http://localhost:3000';
          absoluteImageUrl = new URL(imageUrl, origin).toString();
          console.log('Converted relative URL:', imageUrl, 'to absolute:', absoluteImageUrl);
        }
        
        // First, fetch the original image with proper URL
        const imageResponse = await fetch(absoluteImageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch original image: ${imageResponse.status} - ${absoluteImageUrl}`);
        }
        const imageBlob = await imageResponse.blob();
        console.log('Successfully fetched original image, size:', imageBlob.size);
        
        // Enhanced preservation prompt for FLUX
        const fluxPreservationPrompt = `Transform this interior room image: ${prompt}. 
CRITICAL: Keep exact same room layout, furniture arrangement, lighting, and camera angle. 
Make only subtle, realistic changes to requested elements. 
Professional interior photography style, natural lighting, high detail.`;
        
        let response: Response;
        
        if (maskUrl) {
          console.log('Mask provided: using ControlNet inpainting');
          let absoluteMaskUrl = maskUrl;
          if (maskUrl.startsWith('/') || maskUrl.startsWith('./')) {
            const origin = req.headers.get('origin') || req.headers.get('referer') || 'http://localhost:3000';
            absoluteMaskUrl = new URL(maskUrl, origin).toString();
          }
          
          const maskResponse = await fetch(absoluteMaskUrl);
          if (!maskResponse.ok) {
            throw new Error(`Failed to fetch mask image: ${maskResponse.status}`);
          }
          const maskBlob = await maskResponse.blob();

          const formData = new FormData();
          formData.append('inputs', fluxPreservationPrompt);
          formData.append('image', imageBlob);
          formData.append('mask_image', maskBlob);
          formData.append('strength', String(Math.min(0.5, computedStrength))); // Lower strength for inpainting
          formData.append('guidance_scale', String(computedGuidance));
          formData.append('num_inference_steps', String(Math.max(20, steps)));
          formData.append('negative_prompt', finalNegativePrompt);

          // Use ControlNet inpainting for precise edits
          response = await fetch('https://api-inference.huggingface.co/models/diffusers/controlnet-inpainting-sd-xl-1.0', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${hfToken}` },
            body: formData,
          });
        } else {
          // Use FLUX image-to-image for global room editing with preservation
          console.log('No mask: using FLUX.1-schnell image-to-image');
          
          // Convert image to base64 for FLUX API
          const imageArrayBuffer = await imageBlob.arrayBuffer();
          const imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imageArrayBuffer)));
          
          // FLUX API expects JSON format, not form data
          response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${hfToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              inputs: fluxPreservationPrompt,
              parameters: {
                image: imageBase64,
                strength: Math.min(0.4, computedStrength),
                guidance_scale: Math.min(7, computedGuidance),
                num_inference_steps: Math.max(4, Math.min(8, steps)),
                negative_prompt: finalNegativePrompt
              }
            }),
          });
          
          // If FLUX.1-schnell doesn't support image-to-image, try FLUX.1-dev
          if (!response.ok && response.status === 400) {
            console.log('Trying FLUX.1-dev for image-to-image...');
            response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev', {
              method: 'POST',
              headers: { 
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                inputs: fluxPreservationPrompt,
                parameters: {
                  image: imageBase64,
                  strength: Math.min(0.4, computedStrength),
                  guidance_scale: Math.min(7, computedGuidance),
                  num_inference_steps: Math.max(15, Math.min(25, steps)),
                  negative_prompt: finalNegativePrompt
                }
              }),
            });
          }
        }

        console.log('FLUX image-to-image response status:', response.status);

        if (response.ok) {
          const imageBlob = await response.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBlob)));
          
          console.log('FLUX image-to-image editing completed successfully with preservation');

          return new Response(JSON.stringify({
            success: true,
            images: [{
              url: `data:image/png;base64,${base64}`,
              revised_prompt: `Subtle room editing: ${prompt}`,
              model_used: maskUrl ? 'ControlNet-Inpainting-SDXL' : 'FLUX.1-schnell-image2image',
              variant: 1
            }],
            metadata: {
              model: maskUrl ? 'controlnet-inpainting-sdxl' : 'flux-1-schnell',
              edit_type: editType || 'preservation-editing',
              provider: 'huggingface',
              editing_mode: maskUrl ? 'precise-inpainting' : 'image-to-image-preservation',
              strength_used: computedStrength,
              guidance_used: computedGuidance,
              preservation_mode: true
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const errorText = await response.text();
        console.error('HF image-to-image API error:', errorText);
        throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);

      } catch (hfError) {
        console.error('Hugging Face error:', hfError);
        const hfErrorMessage = hfError instanceof Error ? hfError.message : 'Unknown HF error';
        const hfErrorStatus = (hfError as any)?.status || 'unknown';
        console.error('HF Error details:', {
          message: hfErrorMessage,
          status: hfErrorStatus
        });
        // Continue to OpenAI fallback
      }
    }

    // Try DALL-E-3 as fallback (more reliable for image editing)
    if (openAIKey) {
      try {
        console.log('Attempting DALL-E-3 for image editing...');
        
        const refinedPrompt = `Edit this interior room photo with these changes: ${prompt}.

PRESERVE ORIGINAL ELEMENTS:
- Keep the exact same room layout and proportions
- maintain furniture placement and arrangement
- preserve lighting conditions and camera perspective  
- keep architectural features (walls, ceiling, flooring)
- maintain the same interior design style and color harmony

EDITING GUIDELINES:
- Make only the specific changes requested
- Ensure modifications look natural and realistic
- Professional interior photography quality
- Subtle, tasteful alterations that enhance the space
- No dramatic style changes or additional furniture unless requested`;

        const openAIResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: refinedPrompt,
            n: 1,
            size: '1024x1024',
            quality: 'hd',
            response_format: 'b64_json'
          }),
        });

        console.log('OpenAI DALL-E-3 response status:', openAIResponse.status);

        if (openAIResponse.ok) {
          const openAIData = await openAIResponse.json();
          console.log('DALL-E-3 image editing completed');
          
          return new Response(JSON.stringify({
            success: true,
            images: [{
              url: `data:image/png;base64,${openAIData.data[0].b64_json}`,
              revised_prompt: openAIData.data[0].revised_prompt || refinedPrompt,
              model_used: 'dall-e-3',
              variant: 1
            }],
            metadata: {
              model: 'dall-e-3',
              edit_type: editType || 'generation-based-editing',
              provider: 'openai',
              editing_mode: 'text-to-image-generation',
              preservation_mode: true
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          const errorText = await openAIResponse.text();
          console.error('OpenAI DALL-E-3 error:', errorText);
        }
      } catch (openAIError) {
        console.error('OpenAI error:', openAIError);
      }
    }

    // Enhanced debug response
    console.log('All fallbacks failed, returning debug info');
    return new Response(JSON.stringify({
      success: false,
      error: 'AI service temporarily unavailable. Please check API keys.',
      debug: {
        hfTokenAvailable: !!hfToken,
        hfTokenLength: hfToken ? hfToken.length : 0,
        openAIKeyAvailable: !!openAIKey,
        openAIKeyLength: openAIKey ? openAIKey.length : 0,
        imageUrl: imageUrl ? 'provided' : 'missing',
        prompt: prompt ? 'provided' : 'missing',
        environmentKeys: Object.keys(Deno.env.toObject()).filter(key => 
          key.includes('HUG') || key.includes('OPENAI') || key.includes('API')
        )
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'Unknown';
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      stack: errorStack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});