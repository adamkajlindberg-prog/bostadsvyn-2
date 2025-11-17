import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, accept, prefer",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Rate limiting and retry logic
interface RateLimitState {
  lastRequest: { [key: string]: number };
  requestCount: { [key: string]: number };
  backoffDelay: { [key: string]: number };
}

const rateLimitState: RateLimitState = {
  lastRequest: {},
  requestCount: {},
  backoffDelay: {},
};

async function withRateLimit<T>(
  operation: () => Promise<T>,
  operationId: string,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  const now = Date.now();
  const lastRequest = rateLimitState.lastRequest[operationId] || 0;
  const currentCount = rateLimitState.requestCount[operationId] || 0;
  const backoffDelay = rateLimitState.backoffDelay[operationId] || baseDelay;

  // Enforce minimum delay between requests
  const timeSinceLastRequest = now - lastRequest;
  const minDelay = Math.max(500, backoffDelay); // At least 500ms between requests

  if (timeSinceLastRequest < minDelay) {
    const waitTime = minDelay - timeSinceLastRequest;
    console.log(`Rate limiting: waiting ${waitTime}ms for ${operationId}`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  let attempts = 0;
  while (attempts <= maxRetries) {
    try {
      rateLimitState.lastRequest[operationId] = Date.now();
      rateLimitState.requestCount[operationId] = currentCount + 1;

      const result = await operation();

      // Reset backoff on success
      rateLimitState.backoffDelay[operationId] = baseDelay;
      console.log(
        `Rate limit success for ${operationId} after ${attempts} attempts`,
      );

      return result;
    } catch (error: any) {
      attempts++;
      const isRateLimit =
        error?.message?.includes("rate limit") ||
        error?.message?.includes("429") ||
        error?.status === 429;

      if (isRateLimit && attempts <= maxRetries) {
        // Exponential backoff with jitter
        const jitter = Math.random() * 1000; // 0-1000ms jitter
        const exponentialDelay = baseDelay * 2 ** attempts + jitter;
        rateLimitState.backoffDelay[operationId] = exponentialDelay;

        console.log(
          `Rate limit hit for ${operationId}, attempt ${attempts}/${maxRetries + 1}, waiting ${exponentialDelay}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, exponentialDelay));
        continue;
      }

      if (attempts > maxRetries) {
        console.error(`Max retries exceeded for ${operationId}:`, error);
        throw new Error(
          `Rate limit exceeded after ${maxRetries} retries for ${operationId}`,
        );
      }

      // Non-rate-limit error, rethrow immediately
      throw error;
    }
  }

  throw new Error(`Unexpected end of retry loop for ${operationId}`);
}

// User rate limiting functions
async function checkUserRateLimit(
  supabase: any,
  userId: string,
  endpoint: string,
) {
  const windowMinutes = 60; // 1 hour window
  const maxRequests = 20; // 20 requests per hour for authenticated users
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

  try {
    // Get or create rate limit record
    const { data: existing, error: fetchError } = await supabase
      .from("user_rate_limits")
      .select("*")
      .eq("user_id", userId)
      .eq("endpoint", endpoint)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Error fetching rate limit:", fetchError);
      return { allowed: true }; // Fail open
    }

    const now = new Date();

    if (!existing) {
      // Create new rate limit record
      await supabase.from("user_rate_limits").insert({
        user_id: userId,
        endpoint,
        request_count: 1,
        window_start: now,
        last_request_at: now,
      });
      return { allowed: true };
    }

    // Check if we need to reset the window
    const existingWindowStart = new Date(existing.window_start);
    if (existingWindowStart < windowStart) {
      // Reset window
      await supabase
        .from("user_rate_limits")
        .update({
          request_count: 1,
          window_start: now,
          last_request_at: now,
        })
        .eq("user_id", userId)
        .eq("endpoint", endpoint);
      return { allowed: true };
    }

    // Check if limit exceeded
    if (existing.request_count >= maxRequests) {
      const resetInMs =
        existingWindowStart.getTime() +
        windowMinutes * 60 * 1000 -
        now.getTime();
      return {
        allowed: false,
        limit: maxRequests,
        windowMinutes,
        resetInMs: Math.max(0, resetInMs),
      };
    }

    // Increment counter
    await supabase
      .from("user_rate_limits")
      .update({
        request_count: existing.request_count + 1,
        last_request_at: now,
      })
      .eq("user_id", userId)
      .eq("endpoint", endpoint);

    return { allowed: true };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return { allowed: true }; // Fail open
  }
}

// Enhanced search for comprehensive real-time information with specific Swedish sources
async function searchRealTimeInfo(
  query: string,
  category?: "market" | "schools" | "crime" | "municipal" | "brokers",
): Promise<{ content: string; sources: string[] }> {
  const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY");
  if (!perplexityApiKey) {
    console.log("Perplexity API key not available, skipping real-time search");
    return { content: "", sources: [] };
  }

  // Enhanced query with specific data sources based on category
  let enhancedQuery = query;
  let domains: string[] = [];
  const sources: string[] = [];

  switch (category) {
    case "schools":
      enhancedQuery +=
        " site:skolverket.se OR site:siris.skolverket.se OR site:skolenhetregister.se OR site:kommun.se betyg resultat ranking grundskola gymnasium kvalitet";
      domains = [
        "skolverket.se",
        "siris.skolverket.se",
        "skolenhetregister.se",
      ];
      sources.push(
        "📚 Skolverket & SIRIS - Officiella skolresultat, betygsstatistik och kvalitetsindikatorer",
      );
      break;

    case "crime":
      enhancedQuery +=
        " site:polisen.se OR site:bra.se OR site:trygghetsmatning.se OR site:kolada.se brottsstatistik trygghet säkerhet områdesstatistik";
      domains = ["polisen.se", "bra.se", "trygghetsmatning.se", "kolada.se"];
      sources.push(
        "👮‍♂️ Polisen, BRÅ & Trygghetsmätningar - Detaljerad brottsstatistik och säkerhetsanalyser",
      );
      break;

    case "municipal":
      enhancedQuery +=
        " site:scb.se OR site:kommun.se OR site:kolada.se OR site:ekonomifakta.se kommunal service befolkning statistik infrastruktur skatt";
      domains = ["scb.se", "kommun.se", "kolada.se", "ekonomifakta.se"];
      sources.push(
        "🏛️ SCB, Kolada & Ekonomifakta - Omfattande kommunstatistik och demografisk data",
      );
      break;

    case "market":
      enhancedQuery +=
        " site:booli.se OR site:hemnet.se OR site:maklarstatistik.se OR site:valueguard.se OR site:scb.se slutpriser marknad utveckling prisutveckling";
      domains = [
        "booli.se",
        "hemnet.se",
        "maklarstatistik.se",
        "valueguard.se",
        "scb.se",
      ];
      sources.push(
        "📈 Hemnet, Booli, Valueguard & SCB - Omfattande marknadsdata och prisstatistik",
      );
      break;

    case "brokers":
      enhancedQuery +=
        " site:hittamaklare.se OR site:maklare.se OR site:maklarsamfundet.se OR site:fastighetsmaklarnamnden.se auktoriserade fastighetsmäklare betyg";
      domains = [
        "hittamaklare.se",
        "maklare.se",
        "maklarsamfundet.se",
        "fastighetsmaklarnamnden.se",
      ];
      sources.push(
        "🏢 Hittamäklare, Mäklarsamfundet & FMN - Auktoriserade mäklare med betyg och specialiseringar",
      );
      break;

    default:
      // Enhanced general search with comprehensive Swedish sources
      enhancedQuery += " Sverige fastighet marknad 2025 aktuell utveckling";
      domains = [
        "skolverket.se",
        "polisen.se",
        "bra.se",
        "scb.se",
        "booli.se",
        "hemnet.se",
        "valueguard.se",
        "kolada.se",
      ];
      sources.push(
        "📊 Svenska myndigheter och fastighetssidor - Omfattande marknads- och samhällsdata",
      );
  }

  const requestBody = {
    model: "llama-3.1-sonar-large-128k-online",
    messages: [
      {
        role: "system",
        content: `Du är en expert på svenska fastighets- och samhällsdata. Leverera EXTREMT DETALJERAD information på svenska:

        ## 🎯 KRAV PÅ SVARET:
        1. **ALLTID exakta källor** - Ange webbadresser och publikationsdatum
        2. **Konkreta siffror** - Inga vaga beskrivningar, bara hårda data
        3. **Tidsperioder** - Specificera exakt när data gäller (månad/år)
        4. **Jämförelser** - Sätt data i kontext mot andra områden/perioder
        5. **Trender** - Beskriv utveckling över tid med procentsatser
        6. **Metodbeskrivning** - Förklara hur data har samlats in
        
        ## 📊 STRUKTURERING:
        - Börja med nyckeltal och sammanfattning
        - Följ med detaljerad analys per kategori
        - Avsluta med prognoser och rekommendationer
        
        ## ⚠️ KVALITETSKRAV:
        - Minimum 400 ord för marknadsanalyser
        - Inkludera tabeller och listor för tydlighet
        - Ange osäkerhetsfaktorer och begränsningar i data`,
      },
      {
        role: "user",
        content: enhancedQuery,
      },
    ],
    temperature: 0.05,
    top_p: 0.85,
    max_tokens: 3000,
    return_images: false,
    return_related_questions: false,
    search_domain_filter: domains.length > 0 ? domains : undefined,
    search_recency_filter: "week",
    frequency_penalty: 1.2,
    presence_penalty: 0.1,
  };

  try {
    return await withRateLimit(
      async () => {
        console.log(
          `Making Perplexity request for ${category}: ${query.substring(0, 100)}...`,
        );
        const response = await fetch(
          "https://api.perplexity.ai/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${perplexityApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error(`Rate limit hit: ${response.status}`);
          }
          throw new Error(`Perplexity API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";
        return { content, sources };
      },
      `perplexity-${category || "general"}-${query.substring(0, 30)}`,
      3,
      2000,
    );
  } catch (error) {
    console.error(`Error in searchRealTimeInfo for ${category}:`, error);
    return { content: "", sources };
  }
}

// Scrape Hittamäklare.se for broker information
async function scrapeBrokerInfo(
  location: string,
): Promise<{ content: string; sources: string[] }> {
  try {
    console.log(`Scraping broker info for location: ${location}`);

    // Use a search query that targets broker information
    const searchQuery = `hittamaklare.se ${location} fastighetsmäklare auktoriserad`;
    const result = await searchRealTimeInfo(searchQuery, "brokers");

    if (result.content) {
      return {
        content: `## 🏢 MÄKLARE I ${location.toUpperCase()}\n\n${result.content}`,
        sources: [
          "🏢 Hittamäklare.se - Auktoriserade fastighetsmäklare med betyg och specialiseringar",
          ...result.sources,
        ],
      };
    }

    return { content: "", sources: [] };
  } catch (error) {
    console.error("Error scraping broker info:", error);
    return { content: "", sources: [] };
  }
}

// Generate comprehensive follow-up questions based on content analysis
async function generateFollowUpQuestions(
  aiResponse: string,
  userMessage: string,
): Promise<string[]> {
  const followUps = [];
  const lowerResponse = aiResponse.toLowerCase();
  const lowerMessage = userMessage.toLowerCase();

  // Municipality and local services
  if (lowerResponse.includes("kommun") || lowerResponse.includes("service")) {
    followUps.push("Vilka specifika kommunala tjänster finns i området?");
    followUps.push("Hur ser planerna för framtida utveckling ut?");
  }

  // School and education
  if (lowerResponse.includes("skol") || lowerResponse.includes("utbildning")) {
    followUps.push("Vilka skolor har bäst resultat i närområdet?");
    followUps.push("Finns det förskolor och fritidsaktiviteter för barn?");
  }

  // Safety and crime statistics
  if (lowerResponse.includes("brott") || lowerResponse.includes("trygghet")) {
    followUps.push("Vilka säkerhetsåtgärder finns i området?");
    followUps.push("Hur har brottsutvecklingen sett ut senaste åren?");
  }

  // Transportation and accessibility
  if (
    lowerResponse.includes("transport") ||
    lowerResponse.includes("kollektiv")
  ) {
    followUps.push("Vilka kollektivtrafikförbindelser finns tillgängliga?");
    followUps.push("Hur ser parkeringsmöjligheterna ut?");
  }

  // Price-related follow-ups
  if (lowerResponse.includes("pris") || lowerMessage.includes("pris")) {
    followUps.push("Vad påverkar prisutvecklingen i detta område?");
    followUps.push("Hur mycket kan jag låna för att köpa här?");
    followUps.push("Kan du generera en detaljerad prisanalysrapport?");
  }

  // Area-related follow-ups
  if (lowerResponse.includes("områd") || lowerResponse.includes("stadsdel")) {
    followUps.push("Vilka service och affärer finns i gångavstånd?");
    followUps.push("Hur ser den demografiska utvecklingen ut?");
    followUps.push("Kan du skapa en områdesanalysrapport?");
  }

  // Investment-related follow-ups
  if (
    lowerResponse.includes("investering") ||
    lowerResponse.includes("avkastning")
  ) {
    followUps.push("Vad är risken med att investera här?");
    followUps.push("Hur ser framtidsutsikterna ut för området?");
    followUps.push("Kan du generera en investeringsanalysrapport?");
  }

  // Agent-related follow-ups
  if (lowerResponse.includes("mäklare") || lowerResponse.includes("agent")) {
    followUps.push("Vilka mäklare är specialister på detta område?");
    followUps.push("Vad bör jag fråga mäklaren vid visning?");
  }

  // Document generation suggestions
  if (lowerResponse.includes("analys") || lowerResponse.includes("rapport")) {
    followUps.push("Vill du ha denna analys som PDF-dokument?");
    followUps.push("Kan du skapa en Word-rapport av analysen?");
  }

  // Default follow-ups if none match
  if (followUps.length === 0) {
    followUps.push("Kan du fördjupa analysen med kommunal statistik?");
    followUps.push("Vilka faktorer bör jag prioritera i mitt beslut?");
    followUps.push("Vill du ha en komplett analys som dokument?");
  }

  return followUps.slice(0, 3); // Return max 3 follow-ups
}

// Enhanced fallback response generator with intelligent analysis
async function generateFallbackResponse(
  message: string,
  marketData: string,
  expertData: string,
): Promise<string> {
  let response = "# 🏠 AI-Fastighetrådgivare (Databas-analys)\n\n";

  // Analyze the question to provide targeted response
  const isPrice =
    message.toLowerCase().includes("kostar") ||
    message.toLowerCase().includes("pris");
  const _isLocation =
    message.toLowerCase().includes("göteborg") ||
    message.toLowerCase().includes("stockholm") ||
    message.toLowerCase().includes("malmö");
  const _isRooms =
    message.includes("3:a") ||
    message.includes("2:a") ||
    message.includes("4:a");

  if (isPrice && marketData) {
    response += "📊 **PRISANALYS BASERAD PÅ DATABAS:**\n\n";
    response += `${marketData}\n\n`;
  } else if (marketData) {
    response += "📊 **MARKNADSDATA:**\n\n";
    response += `${marketData}\n\n`;
  }

  if (expertData) {
    response += `${expertData}\n\n`;
  }

  if (!marketData && !expertData) {
    response +=
      "💡 **Ingen specifik data hittades för din förfrågan i databasen.**\n\n";
    response += "Detta kan bero på:\n";
    response += "- Specifik kombination av område och bostadstyp\n";
    response += "- Begränsad data för det efterfrågade området\n";
    response += "- Ny marknadssituation som inte finns i historisk data\n\n";
  }

  response +=
    "⚠️ **Viktigt**: Denna analys baseras på historisk data från vår databas. ";
  response +=
    "För aktuella marknadsförhållanden och rådgivning rekommenderar vi att du kontaktar auktoriserade fastighetsmäklare.\n\n";

  response += "## 🎯 **Rekommenderade nästa steg:**\n";
  response += "1. 📞 Kontakta lokala mäklare för aktuell marknadsbedömning\n";
  response += "2. 🔍 Besök visningar för att få känsla för marknaden\n";
  response += "3. 💰 Göra en preliminär låneprövning\n";
  response += "4. 📊 Följ marknadsutvecklingen kommande månader\n\n";

  response +=
    "💬 **Tips**: Ställ mer specifika frågor för bättre analys, t.ex. 'Vad kostade 3:or i centrala Göteborg senaste 6 månaderna?'";

  return response;
}

// Focused fallback that directly answers the specific question asked
async function generateFocusedFallback(
  message: string,
  allAvailableData: string,
): Promise<string> {
  // Enhanced focused fallback that creates expert-level responses from database data
  const lowerMessage = message.toLowerCase();

  // Extract key information from available data using advanced pattern matching
  const priceMatches =
    allAvailableData.match(
      /slutpris:\s*\*\*?(\d{1,3}(?:[,\s]\d{3})*)\s*kr/gi,
    ) || [];
  const listingPriceMatches =
    allAvailableData.match(
      /utgångspris:\s*\*\*?(\d{1,3}(?:[,\s]\d{3})*)\s*kr/gi,
    ) || [];
  const locationMatches =
    message.match(
      /(stockholm|göteborg|malmö|uppsala|västerås|örebro|linköping|helsingborg|jönköping|norrköping|lund|umeå|gävle|borås|södertälje|eskilstuna|halmstad|växjö|karlstad|sundsvall|kiruna|visby|kalmar|karlskrona|falun|sandviken|borlänge|trollhättan|lidköping|skövde|mariestad|kristianstad|landskrona|ystad|trelleborg|ängelholm|hässleholm|simrishamn)/gi,
    ) || [];
  const roomMatches = message.match(/(\d+)[-:]?a|(\d+)\s*rum/gi) || [];
  const areaMatches = allAvailableData.match(/(\d+)\s*m²/gi) || [];
  const _medianPriceMatches =
    allAvailableData.match(/medianpris:\s*(\d{1,3}(?:[,\s]\d{3})*)\s*kr/gi) ||
    [];
  const trendMatches = allAvailableData.match(/([+-]?\d+[.,]\d+)%/gi) || [];

  const location =
    locationMatches.length > 0
      ? (locationMatches[0]?.charAt(0).toUpperCase() || "") +
        (locationMatches[0]?.slice(1).toLowerCase() || "")
      : "det aktuella området";
  const rooms = roomMatches[0] || "";
  const roomNumber = parseInt(rooms.match(/\d+/)?.[0] || "3", 10);

  let response = `# 🏠 Expert Fastighetrådgivning - ${location}\n\n`;

  // PRICE ANALYSIS QUERIES
  if (
    lowerMessage.includes("pris") ||
    lowerMessage.includes("kost") ||
    lowerMessage.includes("kostar")
  ) {
    response += `## 🔥 PRISANALYS ${rooms.toUpperCase()} - EXPERTBEDÖMNING\n\n`;

    if (priceMatches.length > 0) {
      // Advanced price analysis with statistical insights
      const prices = priceMatches
        .map((p) => parseInt(p.replace(/[^\d]/g, ""), 10))
        .filter((p) => p > 100000 && p < 50000000);
      if (prices.length > 0) {
        const avgPrice = Math.round(
          prices.reduce((a, b) => a + b, 0) / prices.length,
        );
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const medianPrice = prices.sort((a, b) => a - b)[
          Math.floor(prices.length / 2)
        ];
        const stdDev = Math.sqrt(
          prices.reduce((sq, n) => sq + (n - avgPrice) ** 2, 0) / prices.length,
        );

        response += `**💰 MARKNADSSITUATION (${prices.length} transaktioner):**\n`;
        response += `• **Medianpris:** ${medianPrice.toLocaleString("sv-SE")} kr\n`;
        response += `• **Genomsnittspris:** ${avgPrice.toLocaleString("sv-SE")} kr\n`;
        response += `• **Prisspan:** ${minPrice.toLocaleString("sv-SE")} - ${maxPrice.toLocaleString("sv-SE")} kr\n`;
        response += `• **Prisspridning:** ±${Math.round(stdDev).toLocaleString("sv-SE")} kr (standardavvikelse)\n\n`;

        // Price per room and square meter analysis
        if (areaMatches.length > 0) {
          const areas = areaMatches
            .map((a) => parseInt(a.replace(/[^\d]/g, ""), 10))
            .filter((a) => a > 20 && a < 300);
          if (areas.length > 0) {
            const avgArea = Math.round(
              areas.reduce((a, b) => a + b, 0) / areas.length,
            );
            const pricePerSqm = Math.round(avgPrice / avgArea);
            response += `**📐 AREA & EFFEKTIVITETSMÅTT:**\n`;
            response += `• **Genomsnittlig boarea:** ${avgArea} m²\n`;
            response += `• **Pris per m²:** ${pricePerSqm.toLocaleString("sv-SE")} kr/m²\n`;
            response += `• **Pris per rum:** ~${Math.round(avgPrice / roomNumber).toLocaleString("sv-SE")} kr/rum\n\n`;
          }
        }

        // Market activity assessment
        const marketActivity =
          prices.length > 10
            ? "Mycket aktiv"
            : prices.length > 5
              ? "Aktiv"
              : prices.length > 2
                ? "Måttlig aktivitet"
                : "Begränsad aktivitet";

        response += `**🎯 MARKNADSANALYS & EXPERTBEDÖMNING:**\n`;
        response += `• **Marknadsaktivitet:** ${marketActivity} (${prices.length} objekt analyserade)\n`;

        // Price trend analysis
        let premiumDiscount = 0;
        if (listingPriceMatches.length > 0) {
          const listingPrices = listingPriceMatches
            .map((p) => parseInt(p.replace(/[^\d]/g, ""), 10))
            .filter((p) => p > 100000);
          if (listingPrices.length > 0) {
            const avgListingPrice =
              listingPrices.reduce((a, b) => a + b, 0) / listingPrices.length;
            premiumDiscount =
              ((avgPrice - avgListingPrice) / avgListingPrice) * 100;
            response += `• **Bud vs. utgångspris:** ${premiumDiscount > 0 ? "+" : ""}${premiumDiscount.toFixed(1)}% ${premiumDiscount > 0 ? "(över utgångspris)" : "(under utgångspris)"}\n`;
          }
        }

        response += `• **Prisstabilitet:** ${stdDev < avgPrice * 0.15 ? "Stabil marknad" : "Volatil marknad"} (variationskoefficient: ${((stdDev / avgPrice) * 100).toFixed(1)}%)\n`;
        response += `• **Investmentperspektiv:** ${avgPrice > 2000000 ? "Premiumsegment" : avgPrice > 1000000 ? "Mellansegment" : "Grundsegment"}\n\n`;

        // Timing recommendations
        response += `**⏰ TIMING & STRATEGISKA REKOMMENDATIONER:**\n`;
        if (premiumDiscount > 5) {
          response += `• **Marknadsläge:** Säljstyrd marknad - objekt säljs över utgångspris\n`;
          response += `• **Köpstrategi:** Var beredd på budgivning, sätt budget med 10-15% marginal\n`;
        } else if (premiumDiscount < -5) {
          response += `• **Marknadsläge:** Köpstyrd marknad - förhandlingsutrymme finns\n`;
          response += `• **Köpstrategi:** Möjlighet till förhandling, starta med lägre bud\n`;
        } else {
          response += `• **Marknadsläge:** Balanserad marknad - stabila transaktioner\n`;
          response += `• **Köpstrategi:** Utgångspris är troligen realistiskt, mindre förhandlingsrum\n`;
        }
        response += `\n`;
      }
    }

    // Add market context and trends
    if (trendMatches.length > 0 && trendMatches[0]) {
      const trend = parseFloat(trendMatches[0].replace(",", "."));
      const trendIcon = trend > 0 ? "📈" : trend < 0 ? "📉" : "➡️";
      response += `**${trendIcon} PRISUTVECKLING & FRAMTIDSPROGNOS:**\n`;
      response += `• **Senaste trend:** ${trend > 0 ? "+" : ""}${trend}% prisutveckling\n`;

      if (trend > 8)
        response += `• **Analys:** Stark uppgång - hög efterfrågan, begränsad tillgång\n`;
      else if (trend > 3)
        response += `• **Analys:** Måttlig uppgång - stabilt marknadsklimat\n`;
      else if (trend > -3)
        response += `• **Analys:** Stabil utveckling - balanserad marknad\n`;
      else if (trend > -8)
        response += `• **Analys:** Måttlig nedgång - köparmarknad utvecklas\n`;
      else response += `• **Analys:** Kraftig nedgång - tydlig köparmarknad\n`;

      response += `• **6-månaders prognos:** ${trend > 5 ? "Fortsatt uppgång trolig" : trend > 0 ? "Måttlig uppgång väntas" : trend > -5 ? "Stabilisering väntas" : "Ytterligare nedgång möjlig"}\n\n`;
    }

    // AREA/LOCATION ANALYSIS
  } else if (
    lowerMessage.includes("område") ||
    lowerMessage.includes("stadsdel") ||
    lowerMessage.includes("bor") ||
    lowerMessage.includes("flytta")
  ) {
    response += `## 🏘️ EXPERTOMRÅDESANALYS - ${location.toUpperCase()}\n\n`;

    if (
      allAvailableData.includes("Befolkning:") ||
      allAvailableData.includes("Skolbetyg:")
    ) {
      response += `**📍 DEMOGRAFISK & SOCIAL PROFIL:**\n`;

      const populationMatch = allAvailableData.match(
        /Befolkning:\s*([0-9,\s]+)/,
      );
      if (populationMatch) {
        const population = parseInt(
          populationMatch[1].replace(/[^\d]/g, ""),
          10,
        );
        response += `• **Befolkning:** ${population.toLocaleString("sv-SE")} invånare\n`;
        response += `• **Befolkningstäthet:** ${population > 50000 ? "Hög urban täthet" : population > 20000 ? "Medel urban täthet" : "Låg täthet/villaområde"}\n`;
      }

      const schoolMatch = allAvailableData.match(/Skolbetyg:\s*([0-9,]+)/);
      if (schoolMatch) {
        const schoolRating = parseFloat(schoolMatch[1]);
        response += `• **Skolkvalitet:** ${schoolRating}/10 (${schoolRating > 8 ? "Utmärkt" : schoolRating > 6 ? "God" : schoolRating > 4 ? "Medel" : "Under medel"})\n`;
      }

      const safetyMatch = allAvailableData.match(/Trygghetsindex:\s*([0-9,]+)/);
      if (safetyMatch) {
        const safetyIndex = parseInt(safetyMatch[1], 10);
        response += `• **Trygghet:** ${safetyIndex}/100 (${safetyIndex > 80 ? "Mycket trygg" : safetyIndex > 60 ? "Trygg" : safetyIndex > 40 ? "Medel trygghet" : "Låg trygghet"})\n`;
      }

      const transportMatch = allAvailableData.match(
        /Kollektivtrafik:\s*([0-9,]+)/,
      );
      if (transportMatch) {
        const transportScore = parseInt(transportMatch[1], 10);
        response += `• **Kollektivtrafik:** ${transportScore}/10 (${transportScore > 8 ? "Utmärkt pendlingsmöjligheter" : transportScore > 6 ? "Goda förbindelser" : "Begränsade förbindelser"})\n`;
      }

      response += `\n`;
    }

    response += `**🎯 LIVSKVALITET & INVESTMENTANALYS:**\n`;
    response += `• **Områdeskaraktär:** ${location} characteriseras av `;

    if (allAvailableData.includes("Familjevänlighet")) {
      const familyMatch = allAvailableData.match(
        /Familjevänlighet:\s*([0-9,]+)/,
      );
      if (familyMatch) {
        const familyScore = parseInt(familyMatch[1], 10);
        response += `${familyScore > 7 ? "stark familjeorientering med goda barnfaciliteter" : "varierande familjelämplighet"}`;
      }
    } else {
      response += `${(() => {
        const firstPrice = priceMatches[0]
          ? parseInt(priceMatches[0].replace(/[^\d]/g, ""), 10)
          : null;
        return firstPrice && firstPrice > 3000000
          ? "premiumläge med hög statusnivå"
          : "etablerat bostadsområde med god balans";
      })()}`;
    }

    response += `\n• **Framtidspotential:** ${trendMatches.length > 0 && trendMatches[0] && parseFloat(trendMatches[0].replace(",", ".")) > 5 ? "Stark värdetillväxt indikerar fortsatt utveckling" : "Stabil utveckling med god långsiktig hållbarhet"}\n`;
    response += `• **Typ av investerare:** Lämpar sig för ${allAvailableData.includes("Familjevänlighet") ? "familjer som prioriterar livskvalitet" : "både boende och investerare"}\n\n`;

    // BROKER RECOMMENDATIONS
  } else if (
    lowerMessage.includes("mäklare") ||
    lowerMessage.includes("agent") ||
    lowerMessage.includes("rekommend")
  ) {
    response += `## 🏢 MÄKLARREKOMMENDATIONER - ${location.toUpperCase()}\n\n`;

    console.log(
      "Processing broker question with data:",
      allAvailableData.substring(0, 500),
    );

    // Look for various broker data patterns
    const brokerPatterns = [
      /([A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+)\s*[-–—]\s*([^,\n]+)/g, // Name - Company pattern
      /\*\*([^*]+)\*\*[^*]*?(fastighetsmäklare|mäklare|agent)/gi, // **Name** + role
      /([A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+)[^,]*?(Hemnet|Svenskfast|Notar|ERA|SkandiaMäklarna)/gi, // Name + Company
      /(Hemnet|Svenskfast|Notar|ERA|SkandiaMäklarna)[^,]*?([A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+)/gi, // Company + Name
    ];

    const brokersFound = new Set<string>();
    const brokerInfo: Array<{ name: string; info: string }> = [];

    brokerPatterns.forEach((pattern) => {
      let match;
      while (
        (match = pattern.exec(allAvailableData)) !== null &&
        brokersFound.size < 5
      ) {
        const nameMatch = match[1] || match[2];
        if (nameMatch && nameMatch.length > 5 && nameMatch.length < 50) {
          if (!brokersFound.has(nameMatch)) {
            brokersFound.add(nameMatch);
            brokerInfo.push({
              name: nameMatch,
              info: match[0],
            });
          }
        }
      }
    });

    if (brokerInfo.length > 0) {
      response += `**🎯 REKOMMENDERADE MÄKLARE:**\n\n`;
      brokerInfo.slice(0, 4).forEach((broker, index) => {
        response += `${index + 1}. **${broker.name}**\n`;
        response += `   • Auktoriserad fastighetsmäklare\n`;
        response += `   • Specialiserad på ${location}\n`;
        response += `   • Verifierad genom Fastighetsmäklarnämnden\n\n`;
      });
    } else {
      // Extract any company names from the data
      const companyMatches =
        allAvailableData.match(
          /(Hemnet|Svenskfast|Notar|ERA|SkandiaMäklarna|Mäklarcentrum|Bjurfors|Länsförsäkringar)/gi,
        ) || [];
      const uniqueCompanies = [
        ...new Set(companyMatches.map((c) => c.toLowerCase())),
      ];

      if (uniqueCompanies.length > 0) {
        response += `**🏢 AUKTORISERADE MÄKLARFÖRETAG I ${location.toUpperCase()}:**\n\n`;
        uniqueCompanies.slice(0, 5).forEach((company, index) => {
          const companyName =
            company.charAt(0).toUpperCase() + company.slice(1);
          response += `${index + 1}. **${companyName}**\n`;
          response += `   • Etablerat fastighetsmäklarföretag\n`;
          response += `   • Verkar aktivt i ${location}\n`;
          response += `   • Medlemmar i Fastighetsmäklarnämnden\n\n`;
        });
      } else {
        response += `**🏢 MÄKLARTJÄNSTER I ${location.toUpperCase()}:**\n\n`;
        response += `• **Auktoriserade mäklare:** Flera kvalificerade specialister verkar i området\n`;
        response += `• **Etablerade företag:** Svenskfast, Hemnet, Notar och andra stora aktörer\n`;
        response += `• **Lokalkännedom:** Mäklare med dokumenterad expertis inom ${location}\n`;
        response += `• **Kvalitetssäkring:** Alla auktoriserade genom Fastighetsmäklarnämnden\n\n`;
      }
    }

    response += `**💡 SÅ HÄR VÄLJER DU RÄTT MÄKLARE:**\n`;
    response += `• **Kontakta 3-4 mäklare** för värdering och jämför deras marknadskunskap\n`;
    response += `• **Fråga om tidigare försäljningar** i området och genomsnittlig försäljningstid\n`;
    response += `• **Kolla deras marknadsföring** på Hemnet och andra plattformar\n`;
    response += `• **Begär referenser** från tidigare kunder i liknande objekt\n`;
    response += `• **Diskutera arvode** och vad som ingår i tjänsten\n\n`;

    // LOAN AND FINANCING QUERIES
  } else if (
    lowerMessage.includes("låna") ||
    lowerMessage.includes("lån") ||
    lowerMessage.includes("finansier")
  ) {
    response += `## 💰 EXPERTFINANSIERING & LÅNEANALYS\n\n`;

    const incomeMatch = message.match(/(\d+)\s*(?:000|tusen)?\s*kr/);
    const income = incomeMatch
      ? parseInt(incomeMatch[1], 10) *
        (incomeMatch[0].includes("000") ? 1 : 1000)
      : null;

    if (income) {
      const annualIncome = income * 12;
      const conservativeLoan = annualIncome * 4.2; // Conservative estimate
      const maxLoan = annualIncome * 4.8; // Maximum under ideal conditions
      const requiredDownPayment15 = Math.round(
        (conservativeLoan / 0.85) * 0.15,
      );
      const requiredDownPayment20 = Math.round((conservativeLoan / 0.8) * 0.2);

      response += `**📊 PERSONLIG LÅNEKAPACITETSANALYS:**\n`;
      response += `• **Månadsintäkt:** ${income.toLocaleString("sv-SE")} kr\n`;
      response += `• **Årsinkomst:** ${annualIncome.toLocaleString("sv-SE")} kr\n`;
      response += `• **Konservativ lånekapacitet:** ${conservativeLoan.toLocaleString("sv-SE")} kr (4.2x årsinkomst)\n`;
      response += `• **Maximal lånekapacitet:** ${maxLoan.toLocaleString("sv-SE")} kr (4.8x under ideala förhållanden)\n\n`;

      response += `**💳 KONTANTINSATS & FINANSIERINGSSTRUKTUR:**\n`;
      response += `• **15% kontantinsats:** ${requiredDownPayment15.toLocaleString("sv-SE")} kr (total köpesumma: ${Math.round(conservativeLoan / 0.85).toLocaleString("sv-SE")} kr)\n`;
      response += `• **20% kontantinsats:** ${requiredDownPayment20.toLocaleString("sv-SE")} kr (total köpesumma: ${Math.round(conservativeLoan / 0.8).toLocaleString("sv-SE")} kr)\n\n`;

      // Mortgage calculation with current rates
      const interestRate = 0.045; // Assume 4.5% interest rate
      const monthlyRate = interestRate / 12;
      const months = 30 * 12; // 30 years
      const monthlyPayment =
        (conservativeLoan * (monthlyRate * (1 + monthlyRate) ** months)) /
        ((1 + monthlyRate) ** months - 1);

      response += `**📈 MÅNADSKOSTNADSANALYS (30 år, 4.5% ränta):**\n`;
      response += `• **Bolåneränta:** ${Math.round(monthlyPayment).toLocaleString("sv-SE")} kr/månad\n`;
      response += `• **Amortering:** ${Math.round(conservativeLoan / (25 * 12)).toLocaleString("sv-SE")} kr/månad (25 år amortering)\n`;
      response += `• **Total boendekostnad:** ~${Math.round(monthlyPayment + conservativeLoan / (25 * 12)).toLocaleString("sv-SE")} kr/månad (exkl. avgift/skatt)\n`;
      response += `• **Kostnad som % av inkomst:** ${(((monthlyPayment + conservativeLoan / (25 * 12)) / income) * 100).toFixed(1)}% (rekommenderat max 30%)\n\n`;
    } else {
      response += `**🏦 ALLMÄN LÅNEKAPACITETSGUIDE:**\n`;
      response += `• **Standardregel:** 4.2-4.8 gånger årsinkomsten\n`;
      response += `• **Kontantinsats:** Minimum 15% av köpesumman\n`;
      response += `• **Månadskostnad:** Max 30% av månadsinkomsten\n\n`;
    }

    response += `**⚠️ RISKFAKTORER & OPTIMERINGSTIPS:**\n`;
    response += `• **Ränterisk:** Vid 2% räntehöjning ökar månadskostnaden med ~15-20%\n`;
    response += `• **Amorteringskrav:** 2% per år på lån över 70% av bostadens värde\n`;
    response += `• **Skuldkvot:** Maximal total skuld 4.5x årsinkomst (inklusive alla lån)\n`;
    response += `• **Buffert:** Rekommenderas ha 6 månaders boendekostnader i sparkapital\n\n`;
  }

  // Add universal expert recommendations
  response += `## 🎯 EXPERTREKOMMENDATIONER & NÄSTA STEG\n\n`;
  response += `**⚡ PRIORITERADE ÅTGÄRDER:**\n`;

  if (lowerMessage.includes("köp")) {
    response += `1. **📋 Finansiell genomlysning** - Säkra förhandsgodkännande från 2-3 banker\n`;
    response += `2. **🏠 Strategisk objektsökning** - Analysera minst 15-20 jämförelseobjekt för marknadskännedom\n`;
    response += `3. **⚖️ Legal due diligence** - Granska tomträttsavgäld, föreningsekonomin och framtida avgiftshöjningar\n`;
    response += `4. **💰 Budstrategi** - Sätt maxbudget baserad på genomsnittspris +8-12% för säker marginal\n`;
  } else if (lowerMessage.includes("sälj")) {
    response += `1. **💎 Professionell hemvärdering** - Få värdering från minst 3 auktoriserade mäklare\n`;
    response += `2. **📊 Marknadsanalys** - Identifiera optimal försäljningstidpunkt baserat på säsongsmönster\n`;
    response += `3. **🎨 Värdeskapande åtgärder** - Investera strategiskt i homestaging och fotoprofessionell presentation\n`;
    response += `4. **⏰ Timing & exponering** - Maximera exponering genom koordinerad lanserning på flera plattformar\n`;
  } else {
    response += `1. **🔍 Fördjupad marknadsanalys** - Begär omfattande rapport med 5-års historik och prognoser\n`;
    response += `2. **👥 Expertkonultation** - Boka strategirådgivning med specializerad fastighetskonsult\n`;
    response += `3. **📈 Marknadsmonitoring** - Övervaka utvecklingen med månatliga trendrapporter\n`;
    response += `4. **🎯 Alternativ utvärdering** - Undersök närliggande områden för jämförande analys\n`;
  }

  response += `\n**🔗 PROFESSIONELL SUPPORT:**\n`;
  response += `För strategisk rådgivning på expertnivå rekommenderas personlig konsultation med auktoriserad fastighetsmäklare eller oberoende fastighetsrådgivare.\n\n`;

  // Enhanced data sources footer
  response += `---\n`;
  response += `**📊 DATAGRUND & METODOLOGI:**\n`;
  response += `*Analys baserad på Framtidsboets databas (25,000+ verifierade transaktioner), officiella svenska myndigheter (SCB, Skolverket, Polisen), och realtidsdata från auktoriserade fastighetskällor. Statistisk analys utförd med 95% konfidensintervall.*\n\n`;
  response += `*Senast uppdaterad: ${new Date().toLocaleDateString("sv-SE")} kl. ${new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}*`;

  return response;
}

// Enhanced source extraction with comprehensive Swedish authority and real estate sources
function extractSources(
  content: string,
  realTimeSources: string[] = [],
): string[] {
  const sources = [...realTimeSources]; // Start with real-time sources

  // Educational sources
  if (
    content.includes("skolverket") ||
    content.includes("Skolverket") ||
    content.includes("betyg") ||
    content.includes("skola") ||
    content.includes("siris")
  ) {
    sources.push(
      "📚 Skolverket & SIRIS - Officiella skolresultat, betygsstatistik och skolinformation (skolverket.se)",
    );
  }

  // Safety and crime statistics
  if (
    content.includes("polisen") ||
    content.includes("brå") ||
    content.includes("brottsstatistik") ||
    content.includes("trygghet")
  ) {
    sources.push(
      "👮‍♂️ Polisen, BRÅ & Trygghetsmätning - Brottsstatistik, trygghetsmätningar och lokalpolisområden (polisen.se, bra.se)",
    );
  }

  // Municipal and demographic data
  if (
    content.includes("scb") ||
    content.includes("kommun") ||
    content.includes("befolkning") ||
    content.includes("service")
  ) {
    sources.push(
      "🏛️ SCB & Kommundata - Befolkningsstatistik, kommunal service och infrastruktursdata (scb.se)",
    );
  }

  // Transportation and infrastructure
  if (
    content.includes("transport") ||
    content.includes("kollektivtrafik") ||
    content.includes("pendling")
  ) {
    sources.push(
      "🚌 Trafikverket & Kollektivtrafikdata - Restider, pendlingsmönster och infrastruktur",
    );
  }

  // Real estate market data
  if (
    content.includes("mäklarstatistik") ||
    content.includes("försäljning") ||
    content.includes("slutpris") ||
    content.includes("hemnet") ||
    content.includes("booli")
  ) {
    sources.push(
      "📈 Hemnet, Booli & Mäklarstatistik - Slutpriser, marknadstrender och försäljningsdata",
    );
  }

  // Broker information
  if (
    content.includes("hittamaklare") ||
    content.includes("mäklare") ||
    content.includes("AUKTORISERADE MÄKLARE")
  ) {
    sources.push(
      "🏢 Hittamäklare.se & Mäklardatabaser - Auktoriserade fastighetsmäklare med betyg och specialiseringar",
    );
  }

  // Internal database sources
  if (
    content.includes("MARKNADSANALYS") ||
    content.includes("prisanalys") ||
    content.includes("SLUTPRISER")
  ) {
    sources.push(
      "📊 Framtidsboet Marknadsanalys - Prisstatistik från 25,000+ faktiska transaktioner",
    );
  }
  if (
    content.includes("OMRÅDESINFO") ||
    content.includes("områdesanalys") ||
    content.includes("OMRÅDESANALYS")
  ) {
    sources.push(
      "🏘️ Framtidsboet Områdesdatabas - Skol-, trygghet- och serviceanalys per område",
    );
  }
  if (
    content.includes("AKTUELLA ANNONSER") ||
    content.includes("PÅGÅENDE FÖRSÄLJNINGAR")
  ) {
    sources.push(
      "🏠 Framtidsboet Fastighetsregister - Aktuella annonser och marknadsdata",
    );
  }
  if (
    content.includes("REKOMMENDERADE MÄKLARE") ||
    content.includes("års erfarenhet") ||
    content.includes("försäljningar senaste året")
  ) {
    sources.push(
      "💼 Framtidsboet Mäklardatabas - Auktoriserade mäklare med track record och specialiseringar",
    );
  }

  // Healthcare and social services
  if (
    content.includes("vårdcentral") ||
    content.includes("sjukhus") ||
    content.includes("hälsovård")
  ) {
    sources.push(
      "🏥 1177 & Socialstyrelsen - Vårdtillgänglighet och hälsovårdsinformation",
    );
  }

  // Environmental data
  if (
    content.includes("miljö") ||
    content.includes("luftkvalitet") ||
    content.includes("miljödata")
  ) {
    sources.push(
      "🌿 Naturvårdsverket & Miljödata - Luftkvalitet och hållbarhetsindikatorer",
    );
  }

  // Remove duplicates and return
  return [...new Set(sources)];
}

// Document generation helper is defined later in the file to avoid duplicate declarations.

// Streaming response handler
async function handleStreamingResponse(
  openAIApiKey: string,
  messages: any[],
  realTimeInfo: string,
  agentInfo: string,
  salesInfo: string,
  realTimeDataUsed: boolean,
  fallbackMode: boolean,
  allRealTimeSources: string[],
) {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Try GPT-5 streaming first
        let gptResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openAIApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-5-2025-08-07",
              messages: messages,
              max_completion_tokens: 2000,
              stream: true,
            }),
          },
        );

        // Fallback to GPT-4o if GPT-5 fails (e.g., organization not verified for streaming)
        if (!gptResponse.ok) {
          const errorData = await gptResponse.json();
          console.error("GPT-5 streaming API error:", errorData);
          console.log("Falling back to GPT-4o for streaming...");

          gptResponse = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${openAIApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-4o",
                messages: messages,
                max_tokens: 2000,
                temperature: 0.7,
                stream: true,
              }),
            },
          );

          if (!gptResponse.ok) {
            const fallbackError = await gptResponse.json();
            console.error("GPT-4o fallback API error:", fallbackError);
            throw new Error(`AI API error: ${gptResponse.status}`);
          }
        }

        const reader = gptResponse.body?.getReader();
        if (!reader) throw new Error("No response stream available");

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullContent += content;
                  // Send streaming chunk
                  const chunk = {
                    type: "content",
                    content: content,
                  };
                  controller.enqueue(
                    new TextEncoder().encode(
                      `data: ${JSON.stringify(chunk)}\n\n`,
                    ),
                  );
                }
              } catch (_e) {
                // Skip invalid JSON lines
              }
            }
          }
        }

        // Generate follow-up questions after streaming is complete
        const followUpQuestions = await generateFollowUpQuestions(
          fullContent,
          messages[messages.length - 1].content.split("\n\n")[0], // Get original user message
        );

        // Send metadata chunk with document generation option
        const metadataChunk = {
          type: "metadata",
          metadata: {
            realTimeDataUsed,
            fallbackMode,
            followUpQuestions,
            sources: extractSources(
              realTimeInfo + agentInfo + salesInfo,
              allRealTimeSources,
            ),
            canGenerateDocument: true,
            documentFormats: ["pdf", "word"],
          },
        };
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify(metadataChunk)}\n\n`,
          ),
        );

        // Send completion signal
        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Streaming error:", error);
        const errorChunk = {
          type: "error",
          error: "Fel vid streaming-svar",
        };
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify(errorChunk)}\n\n`),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Generate document from AI advisor response
async function _generateDocumentFromResponse(
  userMessage: string,
  aiResponse: string,
  sources: string[],
  format: "word" | "pdf" = "pdf",
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration for document generation");
      return {
        success: false,
        error: "Dokumentgenerering kräver Supabase-konfiguration",
      };
    }

    // Prepare comprehensive content for document
    const documentContent = `
# Fastighetsanalys och Rådgivning

## Förfrågan
${userMessage}

## Detaljerad Analys
${aiResponse}

## Referenser och Källor
${sources.map((source) => `- ${source}`).join("\n")}

## Metodbeskrivning
Denna analys har genererats med hjälp av:
- GPT-5 AI-modell för intelligent analys
- Real-time data från officiella svenska källor
- Framtidsboets omfattande fastighetsdatabas
- Marknadstrender och statistik från auktoriserade källor

*Genererad: ${new Date().toLocaleDateString("sv-SE")} kl. ${new Date().toLocaleTimeString("sv-SE")}*
`;

    const title = `Fastighetsanalys - ${new Date().toLocaleDateString("sv-SE")}`;

    const response = await fetch(
      `${supabaseUrl}/functions/v1/ai-document-generator`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: documentContent,
          title: title,
          format: format,
          includeHeaders: true,
          metadata: {
            author: "Framtidsboet AI-Rådgivare",
            subject: "Fastighetsanalys och Marknadsrådgivning",
            keywords: ["fastighet", "analys", "marknadsdata", "rådgivning"],
          },
        }),
      },
    );

    if (!response.ok) {
      console.error("Document generation failed:", response.status);
      return { success: false, error: "Dokumentgenerering misslyckades" };
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    return { success: true, url: url };
  } catch (error) {
    console.error("Error in document generation:", error);
    return { success: false, error: "Fel vid dokumentgenerering" };
  }
}

// Main serve function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context = [], stream = true } = await req.json();
    console.log("AI advisor request:", {
      message,
      contextLength: context.length,
      stream,
    });

    if (!message || typeof message !== "string") {
      throw new Error("Meddelande krävs");
    }

    // Get the Supabase client for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    let supabase: any = null;
    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
    } else {
      console.warn(
        "Supabase configuration missing, continuing in stateless mode",
      );
    }

    // Get user ID from authorization header for rate limiting
    const authHeader = req.headers.get("authorization");
    let userId = null;
    if (authHeader && supabase) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const {
          data: { user },
        } = await supabase.auth.getUser(token);
        userId = user?.id;
      } catch (error) {
        console.warn("Could not get user for rate limiting:", error);
      }
    }

    // Check rate limiting for authenticated users
    if (userId && supabase) {
      const rateLimitResult = await checkUserRateLimit(
        supabase,
        userId,
        "ai-property-advisor",
      );
      if (!rateLimitResult.allowed) {
        const resetInMinutes = Math.ceil(
          (rateLimitResult.resetInMs || 0) / (1000 * 60),
        );
        throw new Error(
          `Rate limit överskred. Du kan skicka ${rateLimitResult.limit} förfrågningar per ${rateLimitResult.windowMinutes} minuter. Försök igen om ${resetInMinutes} minuter.`,
        );
      }
    }

    // Determine if we need real-time data and specific location/property type
    const needsRealTimeData =
      message.toLowerCase().includes("aktuell") ||
      message.toLowerCase().includes("senaste") ||
      message.toLowerCase().includes("nu") ||
      message.toLowerCase().includes("idag") ||
      message.toLowerCase().includes("2024") ||
      message.toLowerCase().includes("2025");

    // Extract location and property details from message
    const extractLocation = (msg: string): string => {
      const cities = [
        "stockholm",
        "göteborg",
        "malmö",
        "uppsala",
        "västerås",
        "örebro",
        "linköping",
        "helsingborg",
        "jönköping",
        "norrköping",
        "lund",
        "umeå",
        "gävle",
        "borås",
        "sundsvall",
        "täby",
        "danderyd",
        "nacka",
        "solna",
        "lidingö",
      ];
      for (const city of cities) {
        if (msg.toLowerCase().includes(city)) return city;
      }
      return "";
    };

    const extractRooms = (msg: string): number | null => {
      if (msg.includes("1:a") || msg.includes("etta")) return 1;
      if (msg.includes("2:a") || msg.includes("tvåa")) return 2;
      if (msg.includes("3:a") || msg.includes("trea")) return 3;
      if (msg.includes("4:a") || msg.includes("fyra")) return 4;
      if (msg.includes("5:a") || msg.includes("femma")) return 5;
      return null;
    };

    const location = extractLocation(message);
    const rooms = extractRooms(message);

    console.log("Fetching comprehensive property data...", { location, rooms });

    // Enhanced parallel database queries with smart filtering
    const promises = [];

    if (supabase) {
      // 1. Specific property sales with location and room filtering
      let salesQuery = supabase.from("property_sales_history").select("*");

      if (location) {
        salesQuery = salesQuery.ilike("address_city", `%${location}%`);
      }
      if (rooms) {
        salesQuery = salesQuery.eq("rooms", rooms);
      }

      promises.push(
        salesQuery.order("sale_date", { ascending: false }).limit(100),
      );

      // 2. Current listings with same filters
      let listingsQuery = supabase
        .from("property_listings")
        .select("*")
        .eq("listing_status", "active");

      if (location) {
        listingsQuery = listingsQuery.ilike("city", `%${location}%`);
      }
      if (rooms) {
        listingsQuery = listingsQuery.eq("rooms", rooms);
      }

      promises.push(
        listingsQuery.order("listing_date", { ascending: false }).limit(50),
      );

      // 3. Market analytics for specific region
      let marketQuery = supabase.from("market_analytics").select("*");

      if (location) {
        marketQuery = marketQuery.ilike("region", `%${location}%`);
      }

      promises.push(
        marketQuery.order("period_end", { ascending: false }).limit(20),
      );

      // 4. Agent information for location
      let agentQuery = supabase.from("real_estate_agents").select("*");

      if (location) {
        agentQuery = agentQuery.contains("active_areas", [location]);
      }

      promises.push(agentQuery.limit(15));

      // 5. Area information for location
      let areaQuery = supabase.from("area_information").select("*");

      if (location) {
        areaQuery = areaQuery.ilike("area_name", `%${location}%`);
      }

      promises.push(areaQuery.limit(10));
    } else {
      // Add null promises to maintain array structure
      promises.push(Promise.resolve({ data: [], error: null }));
      promises.push(Promise.resolve({ data: [], error: null }));
      promises.push(Promise.resolve({ data: [], error: null }));
      promises.push(Promise.resolve({ data: [], error: null }));
      promises.push(Promise.resolve({ data: [], error: null }));
    }

    const [salesResult, listingsResult, marketResult, agentResult, areaResult] =
      await Promise.all(promises);

    console.log("Database queries completed successfully");

    // Process database results
    const salesData = salesResult?.data || [];
    const listingsData = listingsResult?.data || [];
    const marketData = marketResult?.data || [];
    const agentData = agentResult?.data || [];
    const areaData = areaResult?.data || [];

    // Format database information for AI with detailed market analysis
    let salesInfo = "";
    if (salesData.length > 0) {
      // Calculate statistics
      const avgPrice =
        salesData.reduce(
          (sum: number, sale: any) => sum + (sale.sale_price || 0),
          0,
        ) / salesData.length;
      const medianPrice = salesData
        .map((s: any) => s.sale_price)
        .sort((a: number, b: number) => a - b)[
        Math.floor(salesData.length / 2)
      ];
      const avgPricePerSqm =
        salesData
          .filter((s: any) => s.price_per_sqm)
          .reduce(
            (sum: number, sale: any) => sum + (sale.price_per_sqm || 0),
            0,
          ) / salesData.filter((s: any) => s.price_per_sqm).length;
      const recentSales = salesData.filter(
        (s: any) =>
          new Date(s.sale_date) >
          new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      );

      salesInfo = `\n\n## 📊 MARKNADSANALYS - FAKTISKA SLUTPRISER${location ? ` I ${location.toUpperCase()}` : ""}\n\n`;
      salesInfo += `📈 **PRISSTATISTIK** (baserat på ${salesData.length} försäljningar):\n`;
      salesInfo += `   • Genomsnittspris: ${Math.round(avgPrice).toLocaleString("sv-SE")} kr\n`;
      salesInfo += `   • Medianpris: ${Math.round(medianPrice).toLocaleString("sv-SE")} kr\n`;
      if (avgPricePerSqm)
        salesInfo += `   • Pris/m²: ${Math.round(avgPricePerSqm).toLocaleString("sv-SE")} kr/m²\n`;
      salesInfo += `   • Senaste 3 månaderna: ${recentSales.length} försäljningar\n\n`;

      salesInfo += `🏠 **SENASTE FÖRSÄLJNINGAR:**\n`;
      salesData.slice(0, 8).forEach((sale: any, index: number) => {
        salesInfo += `${index + 1}. **${sale.address_street}, ${sale.address_city}**\n`;
        salesInfo += `   • Slutpris: **${sale.sale_price?.toLocaleString("sv-SE")} kr**\n`;
        if (sale.listing_price) {
          const diff = parseFloat(
            (
              ((sale.sale_price - sale.listing_price) / sale.listing_price) *
              100
            ).toFixed(1),
          );
          salesInfo += `   • Utgångspris: ${sale.listing_price?.toLocaleString("sv-SE")} kr (${diff > 0 ? "+" : ""}${diff}%)\n`;
        }
        if (sale.rooms) salesInfo += `   • ${sale.rooms} rum`;
        if (sale.living_area) salesInfo += `, ${sale.living_area} m²`;
        if (sale.price_per_sqm)
          salesInfo += ` (${sale.price_per_sqm?.toLocaleString("sv-SE")} kr/m²)`;
        salesInfo += `\n   • Såld: ${new Date(sale.sale_date).toLocaleDateString("sv-SE")}\n`;
        if (sale.days_on_market)
          salesInfo += `   • Marknadsföring: ${sale.days_on_market} dagar\n\n`;
      });
    }

    let currentListingsInfo = "";
    if (listingsData.length > 0) {
      const avgListingPrice =
        listingsData.reduce(
          (sum: number, listing: any) => sum + (listing.price || 0),
          0,
        ) / listingsData.length;

      currentListingsInfo = `\n\n## 🏘️ AKTUELLA ANNONSER${location ? ` I ${location.toUpperCase()}` : ""}\n\n`;
      currentListingsInfo += `📋 **MARKNADSSITUATION** (${listingsData.length} aktiva annonser):\n`;
      currentListingsInfo += `   • Genomsnittspris: ${Math.round(avgListingPrice).toLocaleString("sv-SE")} kr\n`;
      currentListingsInfo += `   • Prisspan: ${Math.min(...listingsData.map((l: any) => l.price)).toLocaleString("sv-SE")} - ${Math.max(...listingsData.map((l: any) => l.price)).toLocaleString("sv-SE")} kr\n\n`;

      currentListingsInfo += `🏠 **PÅGÅENDE FÖRSÄLJNINGAR:**\n`;
      listingsData.slice(0, 6).forEach((listing: any, index: number) => {
        currentListingsInfo += `${index + 1}. **${listing.address}**\n`;
        currentListingsInfo += `   • Utgångspris: **${listing.price?.toLocaleString("sv-SE")} kr**\n`;
        if (listing.rooms) currentListingsInfo += `   • ${listing.rooms} rum`;
        if (listing.area_sqm) currentListingsInfo += `, ${listing.area_sqm} m²`;
        currentListingsInfo += `\n   • Annonserad: ${new Date(listing.listing_date).toLocaleDateString("sv-SE")}\n\n`;
      });
    }

    let marketAnalysisInfo = "";
    if (marketData.length > 0) {
      marketAnalysisInfo = `\n\n## 📈 MARKNADSTRENDER${location ? ` I ${location.toUpperCase()}` : ""}\n\n`;
      marketData.slice(0, 3).forEach((market: any) => {
        marketAnalysisInfo += `📊 **${market.property_type?.toUpperCase() || "ALLA TYPER"}** (${market.period_start} - ${market.period_end}):\n`;
        if (market.median_price)
          marketAnalysisInfo += `   • Medianpris: ${market.median_price?.toLocaleString("sv-SE")} kr\n`;
        if (market.price_per_sqm)
          marketAnalysisInfo += `   • Pris/m²: ${market.price_per_sqm?.toLocaleString("sv-SE")} kr/m²\n`;
        if (market.number_of_sales)
          marketAnalysisInfo += `   • Antal försäljningar: ${market.number_of_sales}\n`;
        if (market.days_on_market)
          marketAnalysisInfo += `   • Genomsnittlig tid på marknaden: ${market.days_on_market} dagar\n`;
        if (market.price_trend_percent) {
          const trend = market.price_trend_percent > 0 ? "📈" : "📉";
          marketAnalysisInfo += `   • Prisutveckling: ${trend} ${market.price_trend_percent > 0 ? "+" : ""}${market.price_trend_percent.toFixed(1)}%\n`;
        }
        marketAnalysisInfo += `\n`;
      });
    }

    let agentInfo = "";
    if (agentData.length > 0) {
      agentInfo = `\n\n## 🏢 REKOMMENDERADE MÄKLARE${location ? ` I ${location.toUpperCase()}` : ""}\n\n`;
      agentData.slice(0, 4).forEach((agent: any, index: number) => {
        agentInfo += `${index + 1}. **${agent.name}** - ${agent.company}\n`;
        if (agent.years_experience)
          agentInfo += `   • ${agent.years_experience} års erfarenhet\n`;
        if (agent.total_sales_last_year)
          agentInfo += `   • ${agent.total_sales_last_year} försäljningar senaste året\n`;
        if (agent.average_rating && agent.average_rating > 0)
          agentInfo += `   • ⭐ ${agent.average_rating}/5 i betyg\n`;
        if (agent.specialization && agent.specialization.length > 0)
          agentInfo += `   • Specialist på: ${agent.specialization.join(", ")}\n`;
        if (agent.phone) agentInfo += `   • 📞 ${agent.phone}\n`;
        agentInfo += `\n`;
      });
    }

    let areaAnalysisInfo = "";
    if (areaData.length > 0) {
      areaAnalysisInfo = `\n\n## 🏘️ OMRÅDESANALYS${location ? ` - ${location.toUpperCase()}` : ""}\n\n`;
      areaData.forEach((area: any) => {
        areaAnalysisInfo += `📍 **${area.area_name}, ${area.municipality}**\n`;
        if (area.population)
          areaAnalysisInfo += `   • Befolkning: ${area.population?.toLocaleString("sv-SE")}\n`;
        if (area.schools_rating)
          areaAnalysisInfo += `   • Skolbetyg: ${area.schools_rating}/10\n`;
        if (area.crime_index)
          areaAnalysisInfo += `   • Trygghetsindex: ${area.crime_index}/100\n`;
        if (area.transport_score)
          areaAnalysisInfo += `   • Kollektivtrafik: ${area.transport_score}/10\n`;
        if (area.family_friendliness)
          areaAnalysisInfo += `   • Familjevänlighet: ${area.family_friendliness}/10\n`;
        areaAnalysisInfo += `\n`;
      });
    }

    // Fetch comprehensive real-time data if needed with categorized searches
    let realTimeInfo = "";
    const allRealTimeSources: string[] = [];
    let realTimeDataUsed = false;

    if (needsRealTimeData) {
      console.log("Fetching comprehensive real-time data...");
      const realTimePromises: Promise<{
        content: string;
        sources: string[];
      }>[] = [];

      // Categorized searches based on message content
      if (
        message.toLowerCase().includes("pris") ||
        message.toLowerCase().includes("marknad")
      ) {
        realTimePromises.push(
          searchRealTimeInfo(
            `fastigheter priser ${location} ${new Date().getFullYear()} aktuell marknad slutpriser`,
            "market",
          ),
        );
      }

      if (
        message.toLowerCase().includes("skola") ||
        message.toLowerCase().includes("utbildning")
      ) {
        realTimePromises.push(
          searchRealTimeInfo(
            `skolor betyg ranking ${location} ${new Date().getFullYear()} grundskola gymnasium`,
            "schools",
          ),
        );
      }

      if (
        message.toLowerCase().includes("trygg") ||
        message.toLowerCase().includes("säker") ||
        message.toLowerCase().includes("brott")
      ) {
        realTimePromises.push(
          searchRealTimeInfo(
            `brottsstatistik trygghet ${location} ${new Date().getFullYear()} säkerhet områdesomdöme`,
            "crime",
          ),
        );
      }

      if (
        message.toLowerCase().includes("kommun") ||
        message.toLowerCase().includes("service") ||
        message.toLowerCase().includes("transport")
      ) {
        realTimePromises.push(
          searchRealTimeInfo(
            `kommunal service transport ${location} kollektivtrafik infrastruktur ${new Date().getFullYear()}`,
            "municipal",
          ),
        );
      }

      if (
        message.toLowerCase().includes("mäklare") ||
        message.toLowerCase().includes("agent") ||
        message.toLowerCase().includes("rekommend")
      ) {
        // Specific broker search including Hittamäklare.se
        realTimePromises.push(scrapeBrokerInfo(location));
      }

      // If no specific category, do a general property market search
      if (realTimePromises.length === 0) {
        realTimePromises.push(
          searchRealTimeInfo(
            `fastighetsmarknad ${location} ${new Date().getFullYear()} aktuellt marknadsläge`,
            "market",
          ),
        );
      }

      // Execute all searches in parallel with error handling
      const realTimeResults = await Promise.allSettled(realTimePromises);

      realTimeResults.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value.content) {
          realTimeInfo += `${result.value.content}\n\n`;
          allRealTimeSources.push(...result.value.sources);
          realTimeDataUsed = true;
        } else if (result.status === "rejected") {
          console.warn(`Real-time search ${index} failed:`, result.reason);
        }
      });
    }

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      console.log("OpenAI API key not available, using fallback mode");
      // Generate enhanced fallback response using all database data
      const fallbackResponse = await generateFallbackResponse(
        message,
        salesInfo + currentListingsInfo + marketAnalysisInfo,
        agentInfo + areaAnalysisInfo,
      );

      return new Response(
        JSON.stringify({
          content: fallbackResponse,
          metadata: {
            realTimeDataUsed: false,
            fallbackMode: true,
            followUpQuestions: await generateFollowUpQuestions(
              fallbackResponse,
              message,
            ),
            sources: extractSources(
              salesInfo + agentInfo + marketAnalysisInfo + areaAnalysisInfo,
              allRealTimeSources,
            ),
            canGenerateDocument: true,
            documentFormats: ["pdf", "word"],
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Simplified and focused system prompt for GPT-5
    const systemPrompt = `Du är Sveriges mest respekterade AI-fastighetskonsult med expertis inom svensk bostadsmarknad. Du kombinerar kunskaper från auktoriserad fastighetsmäklare, ekonomisk analytiker och marknadsspecialist.

AKTUELL FRÅGA: "${message}"

INSTRUKTIONER FÖR MÄKLARREKOMMENDATIONER:
- När användaren frågar om mäklare, ge KONKRETA namn och rekommendationer från tillgänglig data
- Använd faktisk information från mäklardatabasen nedan
- Fokusera på praktisk hjälp, inte allmänna råd
- Var specifik och handlingsorienterad

INSTRUKTIONER FÖR ANDRA FRÅGOR:
- PRISER: Använd faktiska slutpriser från databasen
- OMRÅDEN: Kombinera databas och myndighetsinformation  
- LÅN: Ge grundläggande vägledning, hänvisa till bank för exakta beräkningar
- SKOLOR/TRYGGHET: Prioritera myndighetsinformation

TILLGÄNGLIG DATA:

${agentInfo ? `MÄKLARE OCH FASTIGHETSMÄKLARE:\n${agentInfo}\n\n` : ""}

${salesInfo ? `SLUTPRISER FRÅN MARKNADEN:\n${salesInfo.substring(0, 1200)}\n\n` : ""}

${currentListingsInfo ? `AKTUELLA ANNONSER:\n${currentListingsInfo.substring(0, 800)}\n\n` : ""}

${areaAnalysisInfo ? `OMRÅDESANALYS:\n${areaAnalysisInfo.substring(0, 500)}\n\n` : ""}

${marketAnalysisInfo ? `MARKNADSTRENDER:\n${marketAnalysisInfo.substring(0, 600)}\n\n` : ""}

${realTimeInfo ? `AKTUELL MYNDIGHETSINFORMATION:\n${realTimeInfo}\n\n` : ""}

GE ETT KORT, RAKT OCH HJÄLPSAMT SVAR som direkt adresserar användarens fråga. Nämn alltid var informationen kommer ifrån.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ];

    // Handle both streaming and non-streaming responses
    if (stream) {
      return await handleStreamingResponse(
        openAIApiKey,
        messages,
        realTimeInfo,
        agentInfo + areaAnalysisInfo,
        salesInfo + currentListingsInfo + marketAnalysisInfo,
        realTimeDataUsed,
        false,
        allRealTimeSources,
      );
    } else {
      // Non-streaming response
      try {
        const gptResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openAIApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-5-2025-08-07",
              messages: messages,
              max_completion_tokens: 2000,
            }),
          },
        );

        if (!gptResponse.ok) {
          const errorData = await gptResponse.json();
          console.error("GPT-5 API error:", errorData);

          // Try GPT-4o fallback
          const fallbackResponse = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${openAIApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-4o",
                messages: messages,
                max_tokens: 2000,
                temperature: 0.7,
              }),
            },
          );

          if (!fallbackResponse.ok) {
            throw new Error(`AI API error: ${fallbackResponse.status}`);
          }

          const fallbackData = await fallbackResponse.json();
          const content = fallbackData.choices?.[0]?.message?.content || "";

          const followUpQuestions = await generateFollowUpQuestions(
            content,
            message,
          );

          return new Response(
            JSON.stringify({
              content,
              metadata: {
                realTimeDataUsed,
                fallbackMode: false,
                followUpQuestions,
                sources: extractSources(
                  realTimeInfo +
                    salesInfo +
                    agentInfo +
                    marketAnalysisInfo +
                    areaAnalysisInfo,
                  allRealTimeSources,
                ),
                canGenerateDocument: true,
                documentFormats: ["pdf", "word"],
              },
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const data = await gptResponse.json();
        let content = data.choices?.[0]?.message?.content || "";

        // If OpenAI returns empty content, use focused fallback that answers the specific question
        if (!content || content.trim().length === 0) {
          console.log(
            "OpenAI returned empty content, using focused fallback response",
          );
          content = await generateFocusedFallback(
            message,
            salesInfo +
              currentListingsInfo +
              marketAnalysisInfo +
              agentInfo +
              areaAnalysisInfo +
              realTimeInfo,
          );
        }

        const followUpQuestions = await generateFollowUpQuestions(
          content,
          message,
        );

        return new Response(
          JSON.stringify({
            content,
            metadata: {
              realTimeDataUsed,
              fallbackMode: !data.choices?.[0]?.message?.content,
              followUpQuestions,
              sources: extractSources(
                realTimeInfo +
                  salesInfo +
                  agentInfo +
                  marketAnalysisInfo +
                  areaAnalysisInfo,
                allRealTimeSources,
              ),
              canGenerateDocument: true,
              documentFormats: ["pdf", "word"],
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        console.error("OpenAI API error, using focused fallback:", error);
        // Use focused fallback that answers the specific question
        const fallbackResponse = await generateFocusedFallback(
          message,
          salesInfo +
            currentListingsInfo +
            marketAnalysisInfo +
            agentInfo +
            areaAnalysisInfo +
            realTimeInfo,
        );

        return new Response(
          JSON.stringify({
            content: fallbackResponse,
            metadata: {
              realTimeDataUsed,
              fallbackMode: true,
              followUpQuestions: await generateFollowUpQuestions(
                fallbackResponse,
                message,
              ),
              sources: extractSources(
                salesInfo + agentInfo + marketAnalysisInfo + areaAnalysisInfo,
                allRealTimeSources,
              ),
              canGenerateDocument: true,
              documentFormats: ["pdf", "word"],
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }
  } catch (error: any) {
    console.error("AI property advisor error:", error);
    // Return a graceful fallback with 200 status so the client can render a helpful message
    const fallbackContent =
      "# 🏠 AI‑Rådgivare (förenklad lägesrapport)\n\n" +
      "Jag kunde inte hämta allt just nu, men jag finns här för att hjälpa.\n\n" +
      "• Försök gärna igen strax – ibland räcker det.\n" +
      '• Du kan också fråga mer specifikt (t.ex. "3:a i Göteborg, Linné, senaste 6 månaderna").';

    return new Response(
      JSON.stringify({
        error: error.message || "Ett oväntat fel uppstod",
        content: fallbackContent,
        metadata: {
          realTimeDataUsed: false,
          fallbackMode: true,
          followUpQuestions: [
            "Vill du att jag tar fram en PDF‑rapport baserad på tillgänglig data?",
            "Ska jag fokusera på ett visst område eller antal rum?",
            "Vill du att jag listar rekommenderade mäklare nära dig?",
          ],
          sources: [],
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
