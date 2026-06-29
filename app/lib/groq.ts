import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getAIRecommendation(
  company: string,
  financial: any,
  news: any[]
) {
  try {
    const prompt = `
You are an experienced financial analyst.

Analyze the following company and provide an investment recommendation based on their financial metrics and latest news.

Company:
${company}

Financial Data:
${JSON.stringify(financial, null, 2)}

Latest News:
${JSON.stringify(news, null, 2)}

Instructions:
1. Carefully evaluate the P/E ratio, price metrics, market cap, change, and recent news sentiment.
2. Determine if the stock is a BUY, SELL, or HOLD. Be objective and select SELL or HOLD if metrics are poor or news is highly negative.
3. Calculate a realistic confidence level percentage (e.g. "65%", "80%") based on the strength of the indicators.
4. Extract 2 to 3 specific pros and 2 to 3 specific cons from the actual data provided.
5. Provide a short custom summary and future outlook.

Return ONLY valid JSON in this exact structure. Replace the placeholder values with your actual analysis results (do not copy the example values literally):

{
  "action": "BUY", // Must be one of: "BUY", "SELL", "HOLD"
  "confidence": "75%", // Estimate percentage based on your analysis
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
  "risk": {
      "score": 35,
      "level": "Low",
      "volatility": "Medium"
  }
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

    const content =
response.choices[0]?.message?.content || "{}";

// Remove markdown code fences if Groq returns them
const cleaned = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleaned);

  } catch (error) {

    console.error("Groq Error:", error);

    return {
      action: "HOLD",
      confidence: "50%",
      summary: "Unable to generate AI recommendation.",
      pros: [],
      cons: [],
      futureOutlook: "No outlook available.",

      risk: {
        score: 50,
        level: "Medium",
        volatility: "Medium",
      },
    };
  }
}