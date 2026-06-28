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
          className="w-full rounded-lg bg-slate-800 p-4 mb-6"
          placeholder="Tesla"
        />

        <label className="block mb-2">
          Stock Exchange
        </label>

        <select
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
          className="w-full rounded-lg bg-slate-800 p-4 mb-8"
        >
          <option>NSE</option>
          <option>BSE</option>
          <option>NASDAQ</option>
          <option>NYSE</option>
        </select>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-4 text-xl font-bold"
        >
          Analyze Company
        </button>

      </form>

    </section>
  );
}