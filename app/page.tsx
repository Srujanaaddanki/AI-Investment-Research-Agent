"use client";

import { useState } from "react";

import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import AgentCard from "./components/AgentCard";
import ResultsDashboard from "./components/ResultsDashboard";
import SplashScreen from "./components/SplashScreen";

export default function Home() {

  const [showSplash, setShowSplash] = useState(true);

  const [company, setCompany] = useState("");

  const [loading, setLoading] = useState(false);

  const [showDashboard, setShowDashboard] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [agentStatus, setAgentStatus] = useState([
    "Waiting",
    "Waiting",
    "Waiting",
    "Waiting",
    "Waiting",
  ]);

  const [analysisData, setAnalysisData] = useState<any>(null);

  const runAgents = async () => {

    const status = [
      "Waiting",
      "Waiting",
      "Waiting",
      "Waiting",
      "Waiting",
    ];

    setAgentStatus([...status]);

    for (let i = 0; i < status.length; i++) {

      status[i] = "Running...";
      setAgentStatus([...status]);

      await new Promise(resolve => setTimeout(resolve, 900));

      status[i] = "Completed";
      setAgentStatus([...status]);

    }

  };

  const handleAnalyze = async (
    companyName: string,
    exchange: string
  ) => {

    try {

      setLoading(true);
      setError(null);

      setCompany(companyName);

      setShowDashboard(false);

      await runAgents();

      const response = await fetch("/api/analyze", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          company: companyName,

          exchange,

        }),

      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.company && data.company.name === "Company Not Found") {
        throw new Error(`The company "${companyName}" was not found on exchange ${exchange}.`);
      }

      console.log(data);

      setAnalysisData(data);

      setShowDashboard(true);

    } catch (err: any) {

      console.error(err);

      setAgentStatus([
        "Failed",
        "Failed",
        "Failed",
        "Failed",
        "Failed",
      ]);

      setError(err.message || "AI Analysis Pipeline failed to execute. Please verify the company name or check database connection.");

    } finally {

      setLoading(false);

    }

  };

  return (
    <>
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      <main className="min-h-screen bg-slate-950 text-white">

      <Header />

      <section className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-5xl font-bold">

          Research Stocks Smarter

        </h1>

        <p className="mt-5 text-slate-400 max-w-2xl">

          Analyze any listed company using multiple AI agents.

          Get financial insights, latest news,

          risk assessment and intelligent investment suggestions.

        </p>

      </section>

      <SearchSection

        onAnalyze={handleAnalyze}

      />

      {error && (
        <section className="max-w-4xl mx-auto px-6 mb-10">
          <div className="bg-red-950/25 border border-red-500/20 text-red-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300">
            <div>
              <h4 className="font-bold text-red-400 text-lg mb-1">Analysis Failed</h4>
              <p className="text-sm text-red-300/80">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 text-xs font-semibold rounded-xl self-start md:self-center transition-all duration-200 cursor-pointer shadow border border-red-800/35"
            >
              Dismiss
            </button>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold mb-10">

          AI Analysis Pipeline

        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <AgentCard

            title="Research Agent"

            description="Collects company overview."

            status={agentStatus[0]}

          />

          <AgentCard

            title="Financial Agent"

            description="Analyzes financial statements."

            status={agentStatus[1]}

          />

          <AgentCard

            title="News Agent"

            description="Fetches latest market news."

            status={agentStatus[2]}

          />

          <AgentCard

            title="Risk Agent"

            description="Computes investment risk."

            status={agentStatus[3]}

          />

          <AgentCard

            title="Decision Agent"

            description="Generates AI recommendation."

            status={agentStatus[4]}

          />

        </div>

      </section>

      {

        loading && (

          <div className="text-center text-xl pb-10">

            AI Agents are analyzing...

          </div>

        )

      }

      {

        showDashboard && analysisData && (

          <ResultsDashboard

            data={analysisData}

          />

        )

      }

    </main>
    </>
  );

}