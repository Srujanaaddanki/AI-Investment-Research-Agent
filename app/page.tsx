"use client";

import { useState } from "react";

import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import AgentCard from "./components/AgentCard";

export default function Home() {
  const [agentStatus, setAgentStatus] = useState([
    "Waiting",
    "Waiting",
    "Waiting",
    "Waiting",
    "Waiting",
  ]);

  const handleAnalyze = async (
    company: string,
    exchange: string
  ) => {

    console.log(company);
    console.log(exchange);

    const status = [
      "Waiting",
      "Waiting",
      "Waiting",
      "Waiting",
      "Waiting",
    ];

    for (let i = 0; i < status.length; i++) {

      status[i] = "Running...";
      setAgentStatus([...status]);

      await new Promise(resolve => setTimeout(resolve, 1200));

      status[i] = "Completed";
      setAgentStatus([...status]);

    }

  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <Header />

      <section className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-5xl font-bold">
          Research Stocks Smarter
        </h2>

        <p className="mt-5 text-slate-400 max-w-2xl">
          Analyze any listed company using multiple AI agents.
        </p>

      </section>

      <SearchSection onAnalyze={handleAnalyze} />

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold mb-10">
          AI Analysis Agents
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <AgentCard
            title="Research Agent"
            description="Collects company overview and market information."
            status={agentStatus[0]}
          />

          <AgentCard
            title="Financial Agent"
            description="Analyzes revenue, profit, valuation and ratios."
            status={agentStatus[1]}
          />

          <AgentCard
            title="News Agent"
            description="Fetches latest company news and sentiment."
            status={agentStatus[2]}
          />

          <AgentCard
            title="Risk Agent"
            description="Computes investment risks."
            status={agentStatus[3]}
          />

          <AgentCard
            title="Decision Agent"
            description="Produces final investment recommendation."
            status={agentStatus[4]}
          />

        </div>

      </section>

    </main>
  );
}