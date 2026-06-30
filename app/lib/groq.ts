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
You are an experienced financial analyst.

Analyze the following company and provide an investment recommendation based on their financial metrics, latest news, and risk profile.

Company:
${company}

Financial Data:
${JSON.stringify(financial, null, 2)}

Latest News:
${JSON.stringify(news, null, 2)}

Risk Profile:
${JSON.stringify(risk, null, 2)}

Instructions:
1. Carefully evaluate the P/E ratio, price metrics, market cap, change, recent news sentiment, and risk profile (including risk score and level).
2. Rather than blindly recommending BUY/SELL, provide AI-powered investment research that helps users make informed decisions. Choose one of the following recommendation actions:
   - "BUY": High confidence, strong financials, low/moderate risk, positive news.
   - "INVEST": Solid long-term fundamentals, reasonable risk, good news, suitable for investment.
   - "WATCHLIST": Mixed indicators, high valuation, high volatility, or uncertain news. Keep on watchlist.
   - "PASS": Poor financials, very high risk score, or highly negative news.
3. Calculate a realistic confidence level percentage (e.g. "91%", "75%") based on the strength of the indicators.
4. Extract 2 to 3 specific pros and 2 to 3 specific cons from the actual data provided.
5. Identify the key financial metrics that directly influenced this recommendation (list 2-3, providing their name, value, and brief explanation of their impact).
6. Identify the specific news headlines that directly influenced this recommendation (list 1-2, providing their title and brief explanation of their impact). If no news exists, you can state that the lack of news influenced the risk.
7. Provide a short custom summary and future outlook.

Return ONLY valid JSON in this exact structure. Replace the placeholder values with your actual analysis results (do not copy the example values literally):

{
  "action": "INVEST", // Must be one of: "BUY", "INVEST", "WATCHLIST", "PASS"
  "confidence": "91%", // Estimate percentage based on your analysis
  "summary": "A custom 2-3 sentence investment summary.",
  "pros": [
    "Fact-based positive point 1",
    "Fact-based positive point 2"
  ],
  "cons": [
    "Fact-based negative point 1",
    "Fact-based negative point 2"
  ],
  "futureOutlook": "A custom future outlook sentence.",
  "influencingMetrics": [
    {
      "name": "P/E Ratio",
      "value": "18.5",
      "impact": "Positive: Reasonable valuation compared to sector historical average."
    }
  ],
  "influencingNews": [
    {
      "title": "Example Headline",
      "impact": "Positive: Strong quarterly earnings report indicates sustained growth."
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