import YahooFinance from "yahoo-finance2";
import { getLatestNews } from "./news";
import { getAIRecommendation } from "./groq";
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";

const yahooFinance = new YahooFinance();

export interface AgentState {
  companyQuery: string;
  exchange: string;
  
  // Node 1: Research Agent Output
  companyInfo?: {
    name: string;
    symbol: string;
    exchange: string;
    sector: string;
  };

  // Node 2: Financial Agent Output
  financialData?: {
    price: number | null;
    currency: string;
    change: number | null;
    marketCap: number | null;
    peRatio: number | null;
    eps: number | null;
    high52Week: number | null;
    low52Week: number | null;
    volume: number | null;
  };

  // Node 3: News Agent Output
  newsData?: any[];

  // Node 4: Risk Agent Output
  riskProfile?: {
    score: number;
    level: string;
    volatility: string;
  };

  // Node 5: Decision Agent Output
  recommendation?: {
    action: string;
    confidence: string;
    summary: string;
    pros: string[];
    cons: string[];
    futureOutlook: string;
    influencingMetrics?: Array<{ name: string; value: string; impact: string }>;
    influencingNews?: Array<{ title: string; impact: string }>;
  };
}

// Declare the state annotation schema using the official LangGraph Annotation library
export const AgentStateAnnotation = Annotation.Root({
  companyQuery: Annotation<string>(),
  exchange: Annotation<string>(),
  companyInfo: Annotation<AgentState["companyInfo"]>(),
  financialData: Annotation<AgentState["financialData"]>(),
  newsData: Annotation<AgentState["newsData"]>(),
  riskProfile: Annotation<AgentState["riskProfile"]>(),
  recommendation: Annotation<AgentState["recommendation"]>(),
});

// Research Agent Node
async function researchAgentNode(state: typeof AgentStateAnnotation.State): Promise<Partial<typeof AgentStateAnnotation.State>> {
  console.log("[LangGraph Node] Running research_agent...");
  const search: any = await yahooFinance.search(state.companyQuery);
  if (!search?.quotes?.length) {
    throw new Error(`Company "${state.companyQuery}" not found.`);
  }

  const bestMatch =
    search.quotes.find((item: any) => item.quoteType === "EQUITY") ??
    search.quotes[0];

  const symbol = bestMatch.symbol;
  const quote: any = await yahooFinance.quote(symbol);

  const companyInfo = {
    name: quote.longName ?? quote.shortName ?? bestMatch.shortname ?? state.companyQuery,
    symbol,
    exchange: quote.fullExchangeName ?? bestMatch.exchange ?? "N/A",
    sector: quote.sector ?? "N/A",
  };

  console.log(`[LangGraph Communication] research_agent output symbol: "${companyInfo.symbol}"`);
  return { companyInfo };
}

// Financial Agent Node
async function financialAgentNode(state: typeof AgentStateAnnotation.State): Promise<Partial<typeof AgentStateAnnotation.State>> {
  console.log("[LangGraph Node] Preparing financial_agent (Consuming research_agent output)...");
  if (!state.companyInfo) {
    throw new Error("Financial Agent failed: Missing Research Agent output (companyInfo)");
  }

  const symbol = state.companyInfo.symbol;
  const quote: any = await yahooFinance.quote(symbol);

  return {
    financialData: {
      price: quote.regularMarketPrice ?? null,
      currency: quote.currency ?? "USD",
      change: quote.regularMarketChangePercent ?? null,
      marketCap: quote.marketCap ?? null,
      peRatio: quote.trailingPE ?? null,
      eps: quote.epsTrailingTwelveMonths ?? null,
      high52Week: quote.fiftyTwoWeekHigh ?? null,
      low52Week: quote.fiftyTwoWeekLow ?? null,
      volume: quote.regularMarketVolume ?? null,
    }
  };
}

// News Agent Node
async function newsAgentNode(state: typeof AgentStateAnnotation.State): Promise<Partial<typeof AgentStateAnnotation.State>> {
  console.log("[LangGraph Node] Preparing news_agent (Consuming research_agent output)...");
  if (!state.companyInfo) {
    throw new Error("News Agent failed: Missing Research Agent output (companyInfo)");
  }

  let news: any[] = [];
  try {
    news = await getLatestNews(state.companyInfo.name);
  } catch (err) {
    console.error("News Node Error:", err);
  }

  return {
    newsData: news
  };
}

// Risk Agent Node
async function riskAgentNode(state: typeof AgentStateAnnotation.State): Promise<Partial<typeof AgentStateAnnotation.State>> {
  console.log("[LangGraph Node] Running risk_agent (Consuming financial_agent & news_agent outputs)...");
  if (!state.financialData) {
    throw new Error("Risk Agent failed: Missing Financial Agent output (financialData)");
  }

  let riskScore = 50;
  const pe = state.financialData.peRatio;
  if (pe && pe > 35) riskScore += 15;
  if (pe && pe < 15) riskScore -= 10;

  const change = Math.abs(state.financialData.change ?? 0);
  if (change > 5) riskScore += 10;

  // Inter-agent consumption: analyze News Agent output to refine Risk Score
  const newsCount = state.newsData?.length || 0;
  if (newsCount === 0) {
    riskScore += 5; // lack of news raises uncertainty risk
  } else if (newsCount > 5) {
    riskScore += 2; // high news volume might indicate volatility
  }

  riskScore = Math.min(100, Math.max(0, riskScore));
  const riskLevel = riskScore < 35 ? "Low" : riskScore < 70 ? "Medium" : "High";

  const riskProfile = {
    score: riskScore,
    level: riskLevel,
    volatility: change > 5 ? "High" : "Medium",
  };

  console.log(`[LangGraph Communication] risk_agent calculated score: ${riskProfile.score}/100 (${riskProfile.level} Risk)`);
  return { riskProfile };
}

// Decision Agent Node
async function decisionAgentNode(state: typeof AgentStateAnnotation.State): Promise<Partial<typeof AgentStateAnnotation.State>> {
  console.log("[LangGraph Node] Running decision_agent (Consuming all previous agent outputs)...");
  if (!state.companyInfo || !state.financialData || !state.riskProfile) {
    throw new Error("Decision Agent failed: Missing inputs from previous nodes");
  }

  const aiRecommendation = await getAIRecommendation(
    state.companyInfo.name,
    state.financialData,
    state.newsData || [],
    state.riskProfile
  );

  const recommendation = {
    action: aiRecommendation.action || "WATCHLIST",
    confidence: aiRecommendation.confidence || "70%",
    summary: aiRecommendation.summary || "AI recommendation is temporarily unavailable.",
    pros: aiRecommendation.pros || [],
    cons: aiRecommendation.cons || [],
    futureOutlook: aiRecommendation.futureOutlook || "No outlook available.",
    influencingMetrics: aiRecommendation.influencingMetrics || [],
    influencingNews: aiRecommendation.influencingNews || [],
  };

  console.log(`[LangGraph Communication] decision_agent generated recommendation: ${recommendation.action}`);
  return { recommendation };
}

// Build the LangGraph Workflow
const workflow = new StateGraph(AgentStateAnnotation)
  .addNode("research_agent", researchAgentNode)
  .addNode("financial_agent", financialAgentNode)
  .addNode("news_agent", newsAgentNode)
  .addNode("risk_agent", riskAgentNode)
  .addNode("decision_agent", decisionAgentNode)
  // Define edges
  .addEdge(START, "research_agent")
  .addEdge("research_agent", "financial_agent")
  .addEdge("research_agent", "news_agent")
  .addEdge("financial_agent", "risk_agent")
  .addEdge("news_agent", "risk_agent")
  .addEdge("risk_agent", "decision_agent")
  .addEdge("decision_agent", END);

// Compile the graph
const compiledWorkflow = workflow.compile();

// Wrapped export to maintain exactly the same Promise-based .invoke logging interface
export const compiledAgentGraph = Promise.resolve({
  invoke: async (initialState: AgentState): Promise<AgentState> => {
    console.log(`\n=== [LangGraph] Invoking Agent Graph for Query: "${initialState.companyQuery}" ===`);
    const finalState = await compiledWorkflow.invoke(initialState) as AgentState;
    console.log("[LangGraph Communication] financial_agent & news_agent nodes execution finished.");
    console.log("=== [LangGraph] Agent Graph invocation completed successfully ===\n");
    return finalState;
  }
});
