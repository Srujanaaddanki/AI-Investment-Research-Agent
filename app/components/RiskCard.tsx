interface RiskProps {
  risk: {
    score: number;
    level: string;
    volatility: string;
    confidence: string;
  };
}

export default function RiskCard({ risk }: RiskProps) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

      <h3 className="text-xl font-bold mb-5">
        Risk Analysis
      </h3>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-slate-400">
            Risk Score
          </span>

          <span className="font-semibold text-yellow-400">
            {risk.score}/100
          </span>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-3">

          <div
            className="bg-yellow-400 h-3 rounded-full"
            style={{ width: `${risk.score}%` }}
          />

        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            Overall Risk
          </span>

          <span className="text-green-400">
            {risk.level}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            Market Volatility
          </span>

          <span>
            {risk.volatility}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            AI Confidence
          </span>

          <span>
            {risk.confidence}
          </span>
        </div>

      </div>

    </div>
  );
}