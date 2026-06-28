"use client";

import { useState } from "react";

import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import AgentCard from "./components/AgentCard";

export default function Home() {

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (company: string, exchange: string) => {

    console.log("Company:", company);
    console.log("Exchange:", exchange);

    setIsAnalyzing(true);

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
          Get financial insights, latest news,
          risk assessment, and intelligent investment suggestions.
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
            status={isAnalyzing ? "Running..." : "Waiting"}
          />

          <AgentCard
            title="Financial Agent"
            description="Analyzes revenue, profit, valuation and financial ratios."
            status={isAnalyzing ? "Running..." : "Waiting"}
          />

          <AgentCard
            title="News Agent"
            description="Fetches latest company news and market sentiment."
            status={isAnalyzing ? "Running..." : "Waiting"}
          />

          <AgentCard
            title="Risk Agent"
            description="Computes investment risks and possible warning signals."
            status={isAnalyzing ? "Running..." : "Waiting"}
          />

          <AgentCard
            title="Decision Agent"
            description="Combines all AI outputs into a final investment recommendation."
            status={isAnalyzing ? "Running..." : "Waiting"}
          />

        </div>

      </section>

    </main>
  );
}