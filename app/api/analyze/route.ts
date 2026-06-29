import { NextResponse } from "next/server";

import { prisma } from "../../lib/prisma";

import { getCompanyData } from "../../lib/yahoo";
import { getLatestNews } from "../../lib/news";
import { getAIRecommendation } from "../../lib/groq";

export async function POST(request: Request) {
  try {
    const { company } = await request.json();

    // ----------------------------
    // Financial Agent
    // ----------------------------

    const companyData = await getCompanyData(company);

    // ----------------------------
    // News Agent
    // ----------------------------

    let news = [];

    try {
      news = await getLatestNews(company);
    } catch (err) {
      console.error("News Agent Error:", err);

      news = [];
    }

    // ----------------------------
    // Risk Agent
    // ----------------------------

    let riskScore = 50;

    const pe = companyData.financial.peRatio;

    if (pe && pe > 35) riskScore += 15;

    if (pe && pe < 15) riskScore -= 10;

    const change =
      Math.abs(companyData.financial.change ?? 0);

    if (change > 5) riskScore += 10;

    riskScore = Math.min(100, Math.max(0, riskScore));

    const riskLevel =
      riskScore < 35
        ? "Low"
        : riskScore < 70
        ? "Medium"
        : "High";

    // ----------------------------
    // Decision Agent
    // ----------------------------

    let ai = {
      action: "HOLD",
      confidence: "70%",
      summary:
        "AI recommendation is temporarily unavailable.",
      pros: [],
      cons: [],
      futureOutlook:
        "No outlook available.",
    };

    try {
      ai = await getAIRecommendation(
        companyData.company.name,
        companyData.financial,
        news
      );
    } catch (err) {
      console.error("Groq Error:", err);
    }
    
    await prisma.analysis.create({
  data: {
    company: companyData.company.name,
    symbol: companyData.company.symbol,
    exchange: companyData.company.exchange,

    price: companyData.financial.price,
    currency: companyData.financial.currency,

    marketCap: companyData.financial.marketCap,
    peRatio: companyData.financial.peRatio,
    eps: companyData.financial.eps,

    recommendation: ai.action,
    confidence: ai.confidence,

    riskLevel: riskLevel,
    riskScore: riskScore,
  },
});

    return NextResponse.json({
      company: companyData.company,

      financial: companyData.financial,

      news,

      risk: {
        score: riskScore,
        level: riskLevel,
        volatility:
          change > 5 ? "High" : "Medium",
        confidence: ai.confidence,
      },

      recommendation: ai,
    });
  } catch (err) {
    console.error("Route Error:", err);

    return NextResponse.json({
      company: {
        name: "Company Not Found",
        symbol: "-",
        exchange: "-",
        sector: "-",
      },

      financial: {
        price: null,
        currency: "USD",
        change: null,
        marketCap: null,
        peRatio: null,
        eps: null,
        high52Week: null,
        low52Week: null,
        volume: null,
      },

      news: [],

      risk: {
        score: 0,
        level: "Unknown",
        volatility: "Unknown",
        confidence: "0%",
      },

      recommendation: {
        action: "N/A",
        confidence: "0%",
        summary:
          "Unable to analyze this company.",
        pros: [],
        cons: [],
        futureOutlook: "",
      },
    });
  }
}