
import { getHistoricalData } from "../../lib/history";
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { compiledAgentGraph } from "../../lib/agentGraph";

export async function POST(request: Request) {
  try {
    const { company, exchange } = await request.json();

    // ----------------------------
    // Run LangGraph Agent StateGraph
    // ----------------------------
    const graphState = await (await compiledAgentGraph).invoke({
      companyQuery: company,
      exchange: exchange || "NSE",
    });

    const companyInfo = graphState.companyInfo;
    const financialData = graphState.financialData;
    const newsData = graphState.newsData || [];
    const riskProfile = graphState.riskProfile;
    const recommendation = graphState.recommendation;

    if (!companyInfo || !financialData || !riskProfile || !recommendation) {
      throw new Error("LangGraph execution completed with missing state components");
    }

    // ----------------------------
    // Fetch default 1Y historical chart data for initial load
    // ----------------------------
    const historicalData = await getHistoricalData(companyInfo.symbol);

    // Save history search to database
    await prisma.analysis.create({
      data: {
        company: companyInfo.name,
        symbol: companyInfo.symbol,
        exchange: companyInfo.exchange,

        price: financialData.price,
        currency: financialData.currency,

        marketCap: financialData.marketCap,
        peRatio: financialData.peRatio,
        eps: financialData.eps,

        recommendation: recommendation.action,
        confidence: recommendation.confidence,

        riskLevel: riskProfile.level,
        riskScore: riskProfile.score,
      },
    });

    return NextResponse.json({
      company: companyInfo,
      financial: financialData,
      historicalData,
      news: newsData,
      risk: {
        score: riskProfile.score,
        level: riskProfile.level,
        volatility: riskProfile.volatility,
        confidence: recommendation.confidence,
      },
      recommendation: recommendation,
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