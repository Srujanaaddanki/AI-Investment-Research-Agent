"use client";

import { useState } from "react";

import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import AgentCard from "./components/AgentCard";
import ResultsDashboard from "./components/ResultsDashboard";

export default function Home() {

  const [company, setCompany] = useState("");

  const [agentStatus, setAgentStatus] = useState([
    "Waiting",
    "Waiting",
    "Waiting",
    "Waiting",
    "Waiting",
  ]);

  const [showDashboard, setShowDashboard] = useState(false);

  const handleAnalyze = async (
    companyName: string,
    exchange: string
  ) => {

    console.log("Company:", companyName);
    console.log("Exchange:", exchange);

    setCompany(companyName);

    setShowDashboard(false);

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

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      status[i] = "Completed";
      setAgentStatus([...status]);

    }

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    setShowDashboard(true);

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
            description="Collects company profile and business overview."
            status={agentStatus[0]}
          />

          <AgentCard
            title="Financial Agent"
            description="Analyzes revenue, valuation and financial statements."
            status={agentStatus[1]}
          />

          <AgentCard
            title="News Agent"
            description="Collects latest news and market sentiment."
            status={agentStatus[2]}
          />

          <AgentCard
            title="Risk Agent"
            description="Computes investment risks and warning signals."
            status={agentStatus[3]}
          />

          <AgentCard
            title="Decision Agent"
            description="Generates the final AI investment recommendation."
            status={agentStatus[4]}
          />

        </div>

      </section>

      {showDashboard && (

        <ResultsDashboard
          company={company}
        />

      )}

    </main>

  );

}