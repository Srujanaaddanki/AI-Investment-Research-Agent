interface RecommendationProps {
  recommendation: {
    action: string;
    confidence: string;
    summary: string;
    pros?: string[];
    cons?: string[];
    futureOutlook?: string;
    influencingMetrics?: Array<{ name: string; value: string; impact: string }>;
    influencingNews?: Array<{ title: string; impact: string }>;
  };
}

export default function RecommendationCard({
  recommendation,
}: RecommendationProps) {

  const getActionStyle = (action: string) => {
    switch (action?.toUpperCase()) {
      case "BUY":
        return {
          textColor: "text-green-400",
          borderColor: "border-green-500/30",
          bgColor: "bg-green-500/10",
          label: "BUY",
          icon: "📈",
        };
      case "INVEST":
        return {
          textColor: "text-emerald-400",
          borderColor: "border-emerald-500/30",
          bgColor: "bg-emerald-500/10",
          label: "INVEST",
          icon: "💼",
        };
      case "WATCHLIST":
        return {
          textColor: "text-amber-400",
          borderColor: "border-amber-500/30",
          bgColor: "bg-amber-500/10",
          label: "WATCHLIST",
          icon: "👀",
        };
      case "PASS":
        return {
          textColor: "text-rose-400",
          borderColor: "border-rose-500/30",
          bgColor: "bg-rose-500/10",
          label: "PASS",
          icon: "⚠️",
        };
      default:
        return {
          textColor: "text-blue-400",
          borderColor: "border-blue-500/30",
          bgColor: "bg-blue-500/10",
          label: action || "HOLD",
          icon: "🤖",
        };
    }
  };

  const style = getActionStyle(recommendation.action);

  return (
    <div className="bg-slate-900 rounded-2xl border border-blue-700/50 p-6 shadow-xl shadow-blue-950/20">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
        <span>🤖</span> AI Investment Analysis & Recommendation
      </h3>

      <div className="space-y-6">
        {/* Recommendation & Confidence Badges */}
        <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider mb-2">Recommendation</span>
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${style.borderColor} ${style.bgColor} ${style.textColor} font-bold text-lg`}>
              <span>{style.icon}</span>
              <span>{style.label}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 text-center border-l border-slate-800/80">
            <span className="text-xs text-slate-400 uppercase tracking-wider mb-2">AI Confidence</span>
            <span className="text-2xl font-extrabold text-blue-400 tracking-tight">
              {recommendation.confidence}
            </span>
          </div>
        </div>

        {/* AI Summary */}
        <div>
          <h4 className="font-semibold text-slate-200 text-sm mb-2 uppercase tracking-wide">
            Analysis Summary
          </h4>
          <p className={`leading-relaxed text-sm p-4 rounded-xl border ${
            recommendation.summary?.includes("Unable to generate") || recommendation.summary?.includes("temporarily unavailable")
              ? "text-amber-300 bg-amber-950/15 border-amber-800/40"
              : "text-slate-300 bg-slate-950/20 border-slate-800/50"
          }`}>
            {recommendation.summary || "Analysis summary is being generated..."}
          </p>
        </div>

        {/* Influencing Financial Metrics */}
        {recommendation.influencingMetrics && recommendation.influencingMetrics.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3 uppercase tracking-wide">
              Key Influencing Metrics
            </h4>
            <div className="space-y-2">
              {recommendation.influencingMetrics.map((metric, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-950/30 border border-slate-800/60 hover:border-slate-700/80 transition-all text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-300">{metric.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">{metric.value}</span>
                  </div>
                  <span className="text-slate-400 sm:text-right">{metric.impact}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Influencing News Headlines */}
        {recommendation.influencingNews && recommendation.influencingNews.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3 uppercase tracking-wide">
              Influencing News Sentiment
            </h4>
            <div className="space-y-2">
              {recommendation.influencingNews.map((newsItem, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-950/30 border border-slate-800/60 hover:border-slate-700/80 transition-all text-xs space-y-1">
                  <div className="font-medium text-slate-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">📰</span>
                    <span>{newsItem.title}</span>
                  </div>
                  <div className="text-slate-400 pl-6 text-[11px] italic">
                    Impact: {newsItem.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pros & Cons */}
        <div className="grid md:grid-cols-2 gap-4">
          {recommendation.pros && recommendation.pros.length > 0 && (
            <div className="bg-green-950/10 border border-green-500/10 p-4 rounded-xl">
              <h4 className="font-semibold text-green-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>➕</span> Key Drivers (Pros)
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 pl-1">
                {recommendation.pros.map((pro, index) => (
                  <li key={index} className="leading-relaxed">
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendation.cons && recommendation.cons.length > 0 && (
            <div className="bg-rose-950/10 border border-rose-500/10 p-4 rounded-xl">
              <h4 className="font-semibold text-rose-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>➖</span> Key Risks (Cons)
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 pl-1">
                {recommendation.cons.map((con, index) => (
                  <li key={index} className="leading-relaxed">
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Future Outlook */}
        {recommendation.futureOutlook && (
          <div className="border-t border-slate-800/80 pt-4">
            <h4 className="font-semibold text-blue-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🔮</span> Future Outlook
            </h4>
            <p className={`text-sm leading-relaxed ${
              recommendation.futureOutlook === "No outlook available." || recommendation.futureOutlook?.includes("temporarily unavailable")
                ? "text-amber-300/80 italic"
                : "text-slate-300"
            }`}>
              {recommendation.futureOutlook}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}