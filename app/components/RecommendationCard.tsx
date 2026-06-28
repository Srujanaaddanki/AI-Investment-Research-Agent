export default function RecommendationCard() {
  return (
    <div className="bg-slate-900 border border-green-600 rounded-2xl p-6 shadow-lg">

      <h3 className="text-2xl font-bold mb-6">
        AI Recommendation
      </h3>

      <div className="space-y-5">

        <div className="flex justify-between">

          <span className="text-slate-400">
            Recommendation
          </span>

          <span className="text-green-400 font-bold text-xl">
            BUY
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            Confidence
          </span>

          <span className="font-bold">
            91%
          </span>

        </div>

        <div>

          <p className="text-slate-400 mb-2">
            AI Summary
          </p>

          <p className="leading-7">
            The company shows healthy financial performance,
            positive market sentiment and comparatively low
            investment risk. Based on the available information,
            this stock appears suitable for long-term investors.
          </p>

        </div>

      </div>

    </div>
  );
}