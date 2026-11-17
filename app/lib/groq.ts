import Groq from "groq-sdk";

// Models to try in order of preference (fallback chain)
// Updated Nov 2026: older Llama/Mixtral models decommissioned by Groq
const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
];

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("[Groq] GROQ_API_KEY environment variable is not set!");
    throw new Error("GROQ_API_KEY is not configured. Please set it in your environment variables.");
  }
  return new Groq({ apiKey });
}

function buildPrompt(company: string, financial: any, news: any[], risk: any): string {
  return `
You are an expert Wall Street financial analyst and equity researcher.

Analyze the following company and provide an investment recommendation based on their financial metrics, latest news, and risk profile.

Company Name:
${company}

Financial Data:
${JSON.stringify(financial, null, 2)}

Latest News:
${JSON.stringify(news, null, 2)}

Risk Profile:
${JSON.stringify(risk, null, 2)}

Instructions:
1. Carefully evaluate all metrics (P/E ratio, market cap, regular market change, trailing EPS, 52-week price channels, volume) and news sentiment.
2. Choose one of the following recommendation actions:
   - "BUY": High confidence, strong financials, positive news, low/medium risk.
   - "INVEST": Solid long-term fundamentals, reasonable risk, good news, suitable for steady holding.
   - "WATCHLIST": Mixed indicators, high valuation, high volatility, or uncertain news. Keep on watchlist.
   - "PASS": Poor financials, high risk score, or highly negative news.
3. Calculate a dynamic confidence level percentage (e.g. "88%", "65%") based on:
   - Weight of Financial Health (45%)
   - Risk Profile & Score (35%)
   - News Sentiment & Volume (20%)
   Explain the exact confidence calculation and rationale briefly in the "summary" field.
4. Extract 2 to 3 pros and 2 to 3 cons. They must be strictly evidence-based, referencing specific numbers from the provided Financial Data or specific news items from the Latest News.
5. Identify the key financial metrics that directly influenced this recommendation. List 2 to 3 items. For each, provide:
   - "name": Exact metric name (e.g., "P/E Ratio", "52-Week High")
   - "value": The value of the metric
   - "impact": A detailed, professional explanation of how this specific metric supported or detracted from your decision.
6. Identify the specific news headlines that directly influenced this recommendation. List 1 to 2 items. For each, provide:
   - "title": Exact headline title
   - "impact": An explanation of the market/investor sentiment associated with this news and its influence on your recommendation.
7. Provide a detailed "futureOutlook" summarizing the next 6-12 months for the company.

Return ONLY valid JSON in this exact structure. Do NOT wrap it in markdown code fences. Replace the placeholder values with your actual analysis results (do not copy the example values literally):

{
  "action": "INVEST",
  "confidence": "85%",
  "summary": "Detailed investment summary of 3-4 sentences. Include a brief explanation of how you computed the confidence percentage based on the weights (financials, risk, news).",
  "pros": [
    "Evidence-linked positive point (e.g., Trailing P/E of X indicates reasonable value relative to sector)"
  ],
  "cons": [
    "Evidence-linked negative point (e.g., 52-week price is close to its high of Y, suggesting limited short-term upside)"
  ],
  "futureOutlook": "Detailed forward-looking outlook for the next 6-12 months.",
  "influencingMetrics": [
    {
      "name": "P/E Ratio",
      "value": "18.5",
      "impact": "The reasonable valuation indicates the stock is not overhyped, representing lower downside risk."
    }
  ],
  "influencingNews": [
    {
      "title": "Example Headline",
      "impact": "Indicates positive tailwinds due to strong consumer demand for their latest product line."
    }
  ]
}
`;
}

function extractJSON(raw: string): any {
  // Remove markdown code fences if present
  let cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // Try parsing directly
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract JSON object from the string
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Could not extract valid JSON from AI response");
  }
}

export async function getAIRecommendation(
  company: string,
  financial: any,
  news: any[],
  risk: any
) {
  const prompt = buildPrompt(company, financial, news, risk);
  let lastError: any = null;

  // Try each model in the fallback chain
  for (const model of GROQ_MODELS) {
    try {
      console.log(`[Groq] Attempting AI recommendation with model: ${model}`);

      const groq = getGroqClient();

      const response = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 2048,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        console.warn(`[Groq] Model ${model} returned empty content, trying next model...`);
        lastError = new Error(`Model ${model} returned empty content`);
        continue;
      }

      console.log(`[Groq] Raw response from ${model} (first 300 chars):`, content.substring(0, 300));

      const parsed = extractJSON(content);

      // Validate required fields exist
      if (!parsed.action || !parsed.summary) {
        console.warn(`[Groq] Model ${model} returned incomplete JSON, trying next model...`);
        lastError = new Error(`Model ${model} returned JSON without required fields`);
        continue;
      }

      console.log(`[Groq] Successfully generated recommendation with model: ${model}`);
      return parsed;

    } catch (error: any) {
      lastError = error;
      const errorMessage = error?.message || String(error);
      const statusCode = error?.status || error?.statusCode || "unknown";

      console.error(`[Groq] Model ${model} failed (status: ${statusCode}): ${errorMessage}`);

      // If it's an auth error, don't bother trying other models
      if (statusCode === 401 || statusCode === 403 || errorMessage.includes("API key")) {
        console.error("[Groq] Authentication failed — API key is invalid or expired. Stopping retries.");
        break;
      }

      // For rate limits, wait briefly before trying next model
      if (statusCode === 429) {
        console.warn("[Groq] Rate limited, waiting 2s before trying next model...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Continue to next model for other errors
      continue;
    }
  }

  // All models failed — return detailed fallback
  const errorDetail = lastError?.message || "Unknown error";
  console.error(`[Groq] All models exhausted. Last error: ${errorDetail}`);

  return {
    action: "WATCHLIST",
    confidence: "50%",
    summary: `AI analysis is temporarily unavailable. The system attempted multiple AI models but encountered an error: ${errorDetail}. The recommendation defaults to WATCHLIST as a precautionary measure. Please try again shortly.`,
    pros: [],
    cons: [],
    futureOutlook: "AI-powered outlook is temporarily unavailable. Please retry the analysis in a few moments for a complete investment outlook.",
    influencingMetrics: [],
    influencingNews: [],
  };
}