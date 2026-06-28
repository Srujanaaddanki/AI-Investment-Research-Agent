export default function RiskCard() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">

      <h3 className="text-2xl font-bold mb-6">
        Risk Analysis
      </h3>

      <div className="space-y-5">

        <div className="flex justify-between">
          <span className="text-slate-400">Risk Score</span>
          <span className="font-bold text-yellow-400">
            35 / 100
          </span>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-4">

          <div
            className="bg-yellow-500 h-4 rounded-full"
            style={{ width: "35%" }}
          />

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            Overall Risk
          </span>

          <span className="text-green-400 font-semibold">
            Low Risk
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            Market Volatility
          </span>

          <span>
            Medium
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            AI Confidence
          </span>

          <span className="font-semibold">
            91%
          </span>

        </div>

      </div>

    </div>
  );
}