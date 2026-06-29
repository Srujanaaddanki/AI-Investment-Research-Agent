"use client";

import { useState } from "react";

import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import AgentCard from "./components/AgentCard";
import ResultsDashboard from "./components/ResultsDashboard";

export default function Home() {

  const [company, setCompany] = useState("");

  const [loading, setLoading] = useState(false);

  const [showDashboard, setShowDashboard] = useState(false);

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

      const data = await response.json();

      console.log(data);

      setAnalysisData(data);

      setShowDashboard(true);

    } catch (error) {

      console.error(error);

      alert("Analysis Failed");

    } finally {

      setLoading(false);

    }

  };

  return (

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

  );

}