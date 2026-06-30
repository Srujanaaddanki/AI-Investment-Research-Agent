import YahooFinance from "yahoo-finance2";
import { getLatestNews } from "./news";
import { getAIRecommendation } from "./groq";

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

export class StateGraph {
  private nodes: Map<string, (state: AgentState) => Promise<Partial<AgentState>>> = new Map();
  private edges: Map<string, string[]> = new Map();
  private entryPoint: string | null = null;

  addNode(name: string, fn: (state: AgentState) => Promise<Partial<AgentState>>) {
    this.nodes.set(name, fn);
    return this;
  }

  addEdge(from: string, to: string) {
    if (!this.edges.has(from)) {
      this.edges.set(from, []);
    }
    this.edges.get(from)!.push(to);
    return this;
  }

  setEntryPoint(name: string) {
    this.entryPoint = name;
    return this;
  }

  async compile() {
    return {
      invoke: async (initialState: AgentState): Promise<AgentState> => {
        let state = { ...initialState };
        console.log(`\n=== [LangGraph] Invoking Agent Graph for Query: "${state.companyQuery}" ===`);

        // Node 1: Research Agent
        if (this.nodes.has("research_agent")) {
          console.log("[LangGraph Node] Running research_agent...");
          const update = await this.nodes.get("research_agent")!(state);
          state = { ...state, ...update };
          console.log(`[LangGraph Communication] research_agent output symbol: "${state.companyInfo?.symbol}"`);
        }

        // Nodes 2 & 3: Run Financial Agent and News Agent in parallel
        // Both consume Research Agent's output (symbol & name)
        const parallelJobs: Promise<Partial<AgentState>>[] = [];
        
        if (this.nodes.has("financial_agent")) {
          console.log("[LangGraph Node] Preparing financial_agent (Consuming research_agent output)...");
          parallelJobs.push(this.nodes.get("financial_agent")!(state));
        }
        
        if (this.nodes.has("news_agent")) {
          console.log("[LangGraph Node] Preparing news_agent (Consuming research_agent output)...");
          parallelJobs.push(this.nodes.get("news_agent")!(state));
        }

        const updates = await Promise.all(parallelJobs);
        for (const update of updates) {
          state = { ...state, ...update };
        }
        console.log("[LangGraph Communication] financial_agent & news_agent nodes execution finished.");

        // Node 4: Risk Agent
        // Consumes output from Financial Agent (PE, change) and News Agent (sentiment volume)
        if (this.nodes.has("risk_agent")) {
          console.log("[LangGraph Node] Running risk_agent (Consuming financial_agent & news_agent outputs)...");
          const update = await this.nodes.get("risk_agent")!(state);
          state = { ...state, ...update };
          console.log(`[LangGraph Communication] risk_agent calculated score: ${state.riskProfile?.score}/100 (${state.riskProfile?.level} Risk)`);
        }

        // Node 5: Decision Agent
        // Consumes inputs from all previous agent nodes (Research, Financial, News, Risk)
        if (this.nodes.has("decision_agent")) {
          console.log("[LangGraph Node] Running decision_agent (Consuming all previous agent outputs)...");
          const update = await this.nodes.get("decision_agent")!(state);
          state = { ...state, ...update };
          console.log(`[LangGraph Communication] decision_agent generated recommendation: ${state.recommendation?.action}`);
        }

        console.log("=== [LangGraph] Agent Graph invocation completed successfully ===\n");
        return state;
      }
    };
  }
}

// Instantiate and compile the Agent Graph
const graph = new StateGraph();

// Research Agent Node
graph.addNode("research_agent", async (state) => {
  const search: any = await yahooFinance.search(state.companyQuery);
  if (!search?.quotes?.length) {
    throw new Error(`Company "${state.companyQuery}" not found.`);
  }

  const bestMatch =
    search.quotes.find((item: any) => item.quoteType === "EQUITY") ??
    search.quotes[0];

  const symbol = bestMatch.symbol;
  const quote: any = await yahooFinance.quote(symbol);

  return {
    companyInfo: {
      name: quote.longName ?? quote.shortName ?? bestMatch.shortname ?? state.companyQuery,
      symbol,
      exchange: quote.fullExchangeName ?? bestMatch.exchange ?? "N/A",
      sector: quote.sector ?? "N/A",
    }
  };
});

// Financial Agent Node
graph.addNode("financial_agent", async (state) => {
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
});

// News Agent Node
graph.addNode("news_agent", async (state) => {
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
});

// Risk Agent Node
graph.addNode("risk_agent", async (state) => {
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

  return {
    riskProfile: {
      score: riskScore,
      level: riskLevel,
      volatility: change > 5 ? "High" : "Medium",
    }
  };
});

// Decision Agent Node
graph.addNode("decision_agent", async (state) => {
  if (!state.companyInfo || !state.financialData || !state.riskProfile) {
    throw new Error("Decision Agent failed: Missing inputs from previous nodes");
  }

  const aiRecommendation = await getAIRecommendation(
    state.companyInfo.name,
    state.financialData,
    state.newsData || [],
    state.riskProfile
  );

  return {
    recommendation: {
      action: aiRecommendation.action || "WATCHLIST",
      confidence: aiRecommendation.confidence || "70%",
      summary: aiRecommendation.summary || "AI recommendation is temporarily unavailable.",
      pros: aiRecommendation.pros || [],
      cons: aiRecommendation.cons || [],
      futureOutlook: aiRecommendation.futureOutlook || "No outlook available.",
      influencingMetrics: aiRecommendation.influencingMetrics || [],
      influencingNews: aiRecommendation.influencingNews || [],
    }
  };
});

// Establish Edge connections
graph.addEdge("research_agent", "financial_agent");
graph.addEdge("research_agent", "news_agent");
graph.addEdge("financial_agent", "risk_agent");
graph.addEdge("news_agent", "risk_agent");
graph.addEdge("risk_agent", "decision_agent");

graph.setEntryPoint("research_agent");

export const compiledAgentGraph = graph.compile();
