import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getAIRecommendation(
  company: string,
  financial: any,
  news: any[],
  risk: any
) {
  try {
    const prompt = `
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

Return ONLY valid JSON in this exact structure. Replace the placeholder values with your actual analysis results (do not copy the example values literally):

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

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content || "{}";

    // Remove markdown code fences if Groq returns them
    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error("Groq Error:", error);

    return {
      action: "WATCHLIST",
      confidence: "50%",
      summary: "Unable to generate AI recommendation due to API error.",
      pros: [],
      cons: [],
      futureOutlook: "No outlook available.",
      influencingMetrics: [],
      influencingNews: [],
    };
  }
}