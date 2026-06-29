"use client";

import { useState } from "react";

interface SearchSectionProps {
  onAnalyze: (company: string, exchange: string) => void;
}

export default function SearchSection({
  onAnalyze,
}: SearchSectionProps) {

  const [company, setCompany] = useState("");
  const [exchange, setExchange] = useState("NSE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim()) {
      alert("Please enter a company.");
      return;
    }

    onAnalyze(company.trim(), exchange);
  };

  return (
    <section className="max-w-4xl mx-auto py-10 px-6">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 rounded-2xl border border-slate-700 p-8"
      >

        <h2 className="text-2xl font-bold mb-2">
          Search Company
        </h2>

        <p className="text-slate-400 mb-8">
          Enter a company to begin AI analysis.
        </p>

        <label className="block mb-2">
          Company Name
        </label>

        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none p-4 mb-6 transition-all duration-200"
          placeholder="e.g. Apple or TCS"
        />

        <label className="block mb-2 text-sm font-semibold text-slate-300">
          Stock Exchange
        </label>

        <select
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
          className="w-full rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none p-4 mb-8 transition-all duration-200 appearance-none cursor-pointer"
        >
          <option>NSE</option>
          <option>BSE</option>
          <option>NASDAQ</option>
          <option>NYSE</option>
        </select>

        <button
          type="submit"
          className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white py-4 text-lg font-bold shadow-lg shadow-cyan-950/30 transition-all duration-200 active:scale-[0.99] cursor-pointer"
        >
          Analyze Company
        </button>

      </form>

    </section>
  );
}