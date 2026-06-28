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

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">

        <h3 className="text-2xl font-bold mb-2">
          Search Company
        </h3>

        <p className="text-slate-400 mb-8">
          Enter any listed company to begin AI-powered investment analysis.
        </p>

        <div className="space-y-6">

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Company Name
            </label>

            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Apple, Tesla, Infosys..."
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            />

          </div>

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Stock Exchange
            </label>

            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
              <option value="NASDAQ">NASDAQ</option>
              <option value="NYSE">NYSE</option>
            </select>

          </div>


          <button
  onClick={() => {
    alert("Button clicked");
    onAnalyze(company, exchange);
  }}
  disabled={company.trim() === ""}
  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition rounded-xl py-4 font-semibold text-lg"
>
  Analyze Company
</button>


        </div>

      </div>

    </section>
  );
}