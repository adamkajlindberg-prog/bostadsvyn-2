import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PropertyData {
  address: string;
  propertyType: string;
  livingArea: number;
  rooms: number;
  yearBuilt: number;
  plotArea?: number;
  condition: string;
  location: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting property valuation request');
    
    const { propertyData } = await req.json() as { propertyData: PropertyData };
    
    if (!propertyData) {
      throw new Error('Property data is required');
    }

    console.log('Property data received:', propertyData);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get comparable sales from database
    const { data: salesHistory, error: salesError } = await supabase
      .from('property_sales_history')
      .select('*')
      .eq('property_type', propertyData.propertyType.toLowerCase())
      .gte('sale_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) // Last year
      .order('sale_date', { ascending: false })
      .limit(50);

    if (salesError) {
      console.error('Error fetching sales history:', salesError);
    }

    // Get market analytics for the area
    const { data: marketData, error: marketError } = await supabase
      .from('market_analytics')
      .select('*')
      .ilike('region', `%${propertyData.location}%`)
      .eq('property_type', propertyData.propertyType.toLowerCase())
      .order('period_start', { ascending: false })
      .limit(12);

    if (marketError) {
      console.error('Error fetching market data:', marketError);
    }

    // Create AI prompt for property valuation
    const prompt = `
As a professional real estate AI valuator, analyze this property and provide a comprehensive valuation:

Property Details:
- Address: ${propertyData.address}
- Type: ${propertyData.propertyType}
- Living Area: ${propertyData.livingArea} m²
- Rooms: ${propertyData.rooms}
- Built: ${propertyData.yearBuilt}
- Plot Area: ${propertyData.plotArea || 'N/A'} m²
- Condition: ${propertyData.condition}
- Location: ${propertyData.location}

Market Data Available:
${marketData ? `Recent sales in area: ${marketData.length} data points` : 'Limited market data'}
${salesHistory ? `Comparable sales: ${salesHistory.length} properties` : 'No recent comparable sales'}

Provide a detailed JSON response with:
1. Estimated market value (number)
2. Valuation range (low and high)
3. Confidence level (0-100)
4. Market trend analysis
5. Key value factors (positive, negative, neutral)
6. Comparable properties analysis
7. Detailed recommendation

Consider factors like:
- Location desirability and infrastructure
- Property age and condition
- Market trends and recent sales
- Size and layout efficiency
- Local amenities and schools
- Transportation links
- Future development plans

Format the response as valid JSON with Swedish descriptions.
`;

    console.log('Sending request to OpenAI API');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional Swedish real estate valuator with expertise in market analysis and property valuation. Always respond in Swedish and provide accurate, detailed valuations based on current market conditions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI API response received');

    let aiValuation;
    try {
      aiValuation = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback to default structure if parsing fails
      aiValuation = {
        estimatedValue: 0,
        error: 'Could not parse AI valuation response',
        rawResponse: data.choices[0].message.content
      };
    }

    // Log the valuation request for analytics
    const { error: logError } = await supabase
      .from('ai_editor_analytics')
      .insert({
        action_type: 'property_valuation',
        success: true,
        processing_time_ms: Date.now() - Date.now(), // This would need proper timing
        ai_model_used: 'gpt-4o-mini',
        user_id: null, // Would need to extract from auth headers
        session_id: crypto.randomUUID()
      });

    if (logError) {
      console.error('Error logging analytics:', logError);
    }

    console.log('Property valuation completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        valuation: aiValuation,
        marketData: marketData || [],
        comparableSales: salesHistory || []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in property valuation function:', error);
    
    // Log the error for analytics
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase
          .from('ai_editor_analytics')
          .insert({
            action_type: 'property_valuation',
            success: false,
            error_message: (error as Error).message,
            processing_time_ms: Date.now() - Date.now(),
            ai_model_used: 'gpt-4o-mini',
            user_id: null,
            session_id: crypto.randomUUID()
          });
      } catch (logError) {
        console.error('Error logging analytics:', logError);
      }
    }

    return new Response(
      JSON.stringify({ 
        error: (error as Error).message,
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});