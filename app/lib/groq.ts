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

Analyze the following company and provide an investment recommendation.

Company:
${company}

Financial Data:
${JSON.stringify(financial, null, 2)}

Latest News:
${JSON.stringify(news, null, 2)}

Return ONLY valid JSON in this exact format:

{
  "action":"BUY",
  "confidence":"92%",
  "summary":"A short investment summary in 2-3 sentences.",
  "risk":{
      "score":32,
      "level":"Low",
      "volatility":"Medium"
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

      risk: {
        score: 50,
        level: "Medium",
        volatility: "Medium",
      },
    };
  }
}