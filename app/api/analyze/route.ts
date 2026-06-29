import { NextResponse } from "next/server";

import { getCompanyData } from "../../lib/yahoo";
import { getLatestNews } from "../../lib/news";
import { getAIRecommendation } from "../../lib/groq";

export async function POST(request: Request) {
  try {

    const { company } = await request.json();

    // ----------------------------
    // Research Agent
    // ----------------------------

    const companyData = await getCompanyData(company);

    // ----------------------------
    // News Agent
    // ----------------------------

    const news = await getLatestNews(company);

    // ----------------------------
    // Decision Agent (Groq AI)
    // ----------------------------

    const ai = await getAIRecommendation(
      company,
      companyData.financial,
      news
    );

    // ----------------------------
    // Final Response
    // ----------------------------

    return NextResponse.json({

      company: {
        company: companyData.name,
        exchange: companyData.exchange,
        sector: companyData.sector,
        country: companyData.country,
        employees: companyData.employees,
      },

      financial: companyData.financial,

      news,

      risk: {
        score: ai.risk.score,
        level: ai.risk.level,
        volatility: ai.risk.volatility,
        confidence: ai.confidence,
      },

      recommendation: {
        action: ai.action,
        confidence: ai.confidence,
        summary: ai.summary,
      },

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to analyze company.",
      },
      {
        status: 500,
      }
    );

  }
}