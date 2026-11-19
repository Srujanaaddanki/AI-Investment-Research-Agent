# AI Investment Research Agent

An AI-powered multi-agent investment research platform built using **Next.js**, **TypeScript**, **LangGraph**, **Prisma ORM**, and **Yahoo Finance**.

---

## 📈 Overview
This platform automates equity research by executing a state-graph pipeline of specialized AI agents to gather data, analyze news, compute risks, and output structured investment recommendations ("BUY", "INVEST", "WATCHLIST", "PASS") alongside interactive charts.

### Key Features
- **✅ LangGraph State-Graph Workflow**: Implements a real, stateful agent graph where specialised agents communicate with each other by writing and reading a shared state.
- **📈 Historical Line Chart**: Fully interactive area line chart supporting multiple timeframes (`1D`, `5D`, `1M`, `3M`, `6M`, `1Y`, `5Y`) powered by ApexCharts.
- **🕯️ Professional Candlestick Chart**: Shows detailed Open, High, Low, Close (OHLC) candles with color indicators (green/red) and volume bar charts.
- **🤖 Multi-Agent Analysis Pipeline**:
  - **Research Agent**: Resolves stock search queries into ticker symbols and exchange metadata.
  - **Financial Agent**: Fetches company statistics, PE ratio, 52-week margins, market cap, and eps.
  - **News Agent**: Gathers up-to-date market news articles for sentiment evaluation.
  - **Risk Agent**: Computes a deterministic investment risk score based on volatility, metrics, and news frequency.
  - **Decision Agent**: Consumes all previous outputs to compile structured recommendations (BUY/SELL/HOLD, summary, pros, cons, and future outlook) via the Groq SDK.
- **✨ Premium UI/UX Dashboard**: Polished dark-mode UI with dynamic focus indicators, smooth transitions, instant range fetching, and responsive layouts.

---

## 🛠️ Tech Stack & Languages
- **Programming Languages**: TypeScript, JavaScript, SQL (for migrations)
- **Framework & Runtime**: Next.js (App Router), React, Node.js
- **Styling**: Tailwind CSS
- **Database & ORM**: SQLite, Prisma ORM
- **Charting Library**: ApexCharts, React-ApexCharts
- **Market Data Feed**: Yahoo Finance API (via `yahoo-finance2`)
- **LLM SDK**: Groq SDK (running Llama 3.3 70B model)

---

## 🔄 How it works (Approach & Architecture)

The backend utilizes a state-graph execution engine built with **LangGraph.js**:

```mermaid
graph TD
    Entry([Start: Ticker Query]) --> RA[Research Agent]
    RA -->|Resolves Ticker Symbol| FA[Financial Agent]
    RA -->|Resolves Company Name| NA[News Agent]
    FA -->|Financial Ratios & Metrics| Risk[Risk Agent]
    NA -->|Market News Articles| Risk
    FA -->|Consolidates State| DA[Decision Agent]
    NA -->|Consolidates State| DA
    Risk -->|Risk Score & Levels| DA
    DA --> Exit([Final AI Investment Report])
```

### The State Graph Workflow
1. **State Initialization**: The graph is invoked with `companyQuery` (e.g. "Apple") and `exchange`.
2. **Research Node**: Searches Yahoo Finance for the ticker, picks the best match, and updates state with `companyInfo`.
3. **Financial & News Nodes (Parallel Execution)**:
   - Financial Agent queries the real-time quote for the symbol.
   - News Agent pulls recent articles based on the resolved company name.
4. **Risk Node**: Calculates the risk level by evaluating PE metrics, price change percent, and adjusting the score based on the volume of news articles gathered (inter-agent consumption).
5. **Decision Node**: Invokes Groq to analyze the consolidated state (overview, financial metrics, news, risk profile) to write the final advice, summary, pros, cons, and future outlook.

---

## 📦 How to run it

### Prerequisites
- Node.js (v18.x or above)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Srujanaaddanki/AI-Investment-Research-Agent.git
cd AI-Investment-Research-Agent/ai-investment-agent
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the `ai-investment-agent` root directory:
```env
GROQ_API_KEY=your_groq_api_key
NEWS_API_KEY=your_news_api_key
DATABASE_URL="file:./dev.db"
```
Configure your `.env` file as well:
```env
DATABASE_URL="file:./dev.db"
```

### 3. Setup Database Schema
Push the Prisma database schema and generate the client:
```bash
npx prisma generate
npx prisma db push
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to start searching stocks.
```
𝐥𝐢𝐯𝐞 𝐋𝐢𝐧𝐤 𝐨𝐟 𝐃𝐚𝐬𝐡𝐛𝐨𝐚𝐫𝐝 - https://ai-investment-research-agent-gamma.vercel.app/
```

---

## 🧠 Key decisions & trade-offs

- **LangGraph.js for State Management**: Instead of nesting simple promises, we chose `@langchain/langgraph` to represent our agent nodes. This allows for clean state tracking, where each agent only edits specific fields of a shared annotation-root state. It also simplifies running tasks in parallel (like fetching financial metrics and searching news headlines) and joining their states before executing the risk evaluation.
- **SQLite Database with Prisma ORM**: For a lightweight take-home submission, zipping and carrying a heavy database client (like Docker-based PostgreSQL) is inconvenient. SQLite allows the app to be fully self-contained. The DB creation in `app/api/analyze/route.ts` is wrapped in a try-catch block so that if the project is deployed to a read-only serverless platform like Vercel, it fails gracefully without disrupting the user experience.
- **Groq SDK with Llama-3.3-70B**: The Groq API is chosen for its ultra-low latency and superior JSON structure compliance. Wall Street analysis requires consistent structured JSON formatting, and Llama 3.3 70B performs on-par with GPT-4 in structured JSON generation tasks while responding in under 2 seconds.
- **Graceful API Fallbacks**: News APIs are notorious for rate-limiting or requiring paid tiers. In `app/lib/news.ts`, if the API query fails, the News Agent returns a structured placeholder block rather than throwing a system-wide exception, preventing API failure from crashing the entire analysis graph.
- **Dynamic Frontend Animations vs Async Graph Processing**: A simulated step-timeline on the frontend (`runAgents` progress updates) keeps users engaged while the backend API asynchronously computes and compiles the report, making the UI feel fast and professional.

---
---
## 📈 Some Images

Some images of project
<img width="1280" height="627" alt="image" src="https://github.com/user-attachments/assets/54747931-ba42-4514-a703-297c31e94f63" />

line chat and candle chart fro better understanding 
<img width="1278" height="627" alt="image" src="https://github.com/user-attachments/assets/937e7026-d4d8-4461-abbf-444c0527c00f" />
<img width="1276" height="634" alt="image" src="https://github.com/user-attachments/assets/3db6e2c0-4b2b-415f-9324-b4ba0320417c" />

Company Overview , Financial Summary,Latest News
<img width="1280" height="624" alt="image" src="https://github.com/user-attachments/assets/f65ee899-bf02-4592-9247-828be724820d" />

AI Risk Analysis and 🤖 AI Investment Analysis & Recommendation
<img width="1279" height="629" alt="image" src="https://github.com/user-attachments/assets/ea757012-d8ef-4460-800d-eec58b779a97" />
<img width="1279" height="633" alt="image" src="https://github.com/user-attachments/assets/5231da9e-9478-4661-ab8b-18c98e03ca0b" />

```
```
## 📈 Example runs

Below is the actual output generated by the AI Investment Research Agent for a query on **Apple (AAPL)**:

### 1. General Info & Market Stats
- **Company Name**: Apple Inc.
- **Ticker Symbol**: AAPL (NASDAQ)
- **Sector**: Tech
- **Current Price**: $294.42 USD
- **PE Ratio**: 35.69
- **Trailing EPS**: $8.25

### 2. Risk Score & Volatility Assessment
- **Overall Risk Score**: 65 / 100
- **Risk Level**: Medium
- **Volatility**: Medium
- **AI Confidence**: 78%

### 3. Key Drivers & Risks Identified
- **➕ Key Drivers (Pros)**:
  - The trailing EPS of $8.25 indicates a strong profitability trend for Apple Inc.
  - A market cap of $4.32T suggests a stable, well-established company with deep resources.
  - A premium P/E of 35.69 is justified by Apple's brand strength and ecosystem.
- **➖ Key Risks (Cons)**:
  - The 52-week high of $317.4 is close to the current price, limiting short-term upside.
  - Legal disputes (like the App Store Ninth Circuit dispute) introduce regulatory friction.
  - High overall valuation suggests significant expectations are already priced in.

### 4. Recommendation Decision
- **Action**: `INVEST`
- **Summary**: Our investment recommendation is based on a comprehensive analysis of Apple Inc.'s financial health, risk profile, and news sentiment. The confidence level of 78% is calculated by weighing financial health at 45% (strong market cap and trailing EPS), risk profile at 35% (medium risk score), and news sentiment at 20% (neutral to slightly positive news). The financials indicate a stable company with a high market cap and reasonable valuation.

---

## 🔮 What you would improve with more time

1. **Multi-Turn Chat History (Agent Memory)**: Implement memory in LangGraph to allow users to ask follow-up questions about the generated report (e.g., *"Why did you think the valuation is high?"* or *"Compare this with Microsoft's P/E"*).
2. **Deep SEC Document Extraction**: Integrate an agent that pulls the latest 10-K and 10-Q reports directly from the SEC EDGAR API and runs vector search (RAG) to find hidden lease liabilities or executive warnings.
3. **Advanced Technical Indicators**: Add Moving Averages (EMA/SMA), RSI, and MACD lines to the interactive ApexCharts frontend.
4. **Export Reports**: Allow users to download the compiled AI Investment Report as a formatted PDF or CSV file.

---
