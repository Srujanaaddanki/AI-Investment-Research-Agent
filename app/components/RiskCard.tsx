interface RiskProps {
  risk: {
    score: number;
    level: string;
    volatility: string;
    confidence: string;
  };
}

export default function RiskCard({
  risk,
}: RiskProps) {

  const getColor = () => {

    if (risk.score <= 35)
      return "bg-green-500";

    if (risk.score <= 70)
      return "bg-yellow-500";

    return "bg-red-500";

  };

  const getTextColor = () => {

    if (risk.score <= 35)
      return "text-green-400";

    if (risk.score <= 70)
      return "text-yellow-400";

    return "text-red-400";

  };

  return (

    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

      <h3 className="text-xl font-bold mb-6">

        AI Risk Analysis

      </h3>

      <div className="space-y-5">

        <div>

          <div className="flex justify-between mb-2">

            <span className="text-slate-400">

              Overall Risk Score

            </span>

            <span className={getTextColor()}>

              {risk.score}/100

            </span>

          </div>

          <div className="w-full bg-slate-700 rounded-full h-3">

            <div

              className={`${getColor()} h-3 rounded-full transition-all duration-700`}

              style={{

                width: `${risk.score}%`

              }}

            />

          </div>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">

            Risk Level

          </span>

          <span className={getTextColor()}>

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