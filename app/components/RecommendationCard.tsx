interface RecommendationProps {
  recommendation: any;
}

export default function RecommendationCard({
  recommendation,
}: RecommendationProps) {

  if (!recommendation) {
    return null;
  }

  const action =
    recommendation.action ??
    recommendation.recommendation ??
    "HOLD";

  const confidence =
    recommendation.confidence ?? "80%";

  const summary =
    recommendation.summary ??
    recommendation.reason ??
    "AI analysis will appear here.";

  const color =
    action === "BUY"
      ? "text-green-400"
      : action === "SELL"
      ? "text-red-400"
      : "text-yellow-400";

  return (

    <div className="bg-slate-900 rounded-2xl border border-green-700 p-6">

      <h3 className="text-xl font-bold mb-5">
        AI Recommendation
      </h3>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-slate-400">
            Recommendation
          </span>

          <span className={`text-xl font-bold ${color}`}>
            {action}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            Confidence
          </span>

          <span>
            {confidence}
          </span>
        </div>

        <div>
          <p className="text-slate-400 mb-2">
            AI Summary
          </p>

          <p className="text-slate-200 leading-7">
            {summary}
          </p>
        </div>

      </div>

    </div>

  );

}