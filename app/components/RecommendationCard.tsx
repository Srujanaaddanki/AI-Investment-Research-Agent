interface RecommendationProps {
  recommendation: {
    action: string;
    confidence: string;
    summary: string;
    pros?: string[];
    cons?: string[];
    futureOutlook?: string;
  };
}

export default function RecommendationCard({
  recommendation,
}: RecommendationProps) {

  const color =
    recommendation.action === "BUY"
      ? "text-green-400"
      : recommendation.action === "SELL"
      ? "text-red-400"
      : "text-yellow-400";

  return (

    <div className="bg-slate-900 rounded-2xl border border-blue-700 p-6">

      <h3 className="text-xl font-bold mb-6">

        🤖 AI Investment Recommendation

      </h3>

      <div className="space-y-5">

        <div className="flex justify-between">

          <span className="text-slate-400">

            Recommendation

          </span>

          <span className={`text-2xl font-bold ${color}`}>

            {recommendation.action}

          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">

            Confidence

          </span>

          <span>

            {recommendation.confidence}

          </span>

        </div>

        <div>

          <h4 className="font-semibold mb-2">

            AI Summary

          </h4>

          <p className="text-slate-300 leading-7">

            {recommendation.summary}

          </p>

        </div>

        {

          recommendation.pros &&
          recommendation.pros.length > 0 && (

            <div>

              <h4 className="font-semibold text-green-400 mb-2">

                Pros

              </h4>

              <ul className="list-disc list-inside space-y-1">

                {

                  recommendation.pros.map((pro, index) => (

                    <li key={index}>

                      {pro}

                    </li>

                  ))

                }

              </ul>

            </div>

          )

        }

        {

          recommendation.cons &&
          recommendation.cons.length > 0 && (

            <div>

              <h4 className="font-semibold text-red-400 mb-2">

                Cons

              </h4>

              <ul className="list-disc list-inside space-y-1">

                {

                  recommendation.cons.map((con, index) => (

                    <li key={index}>

                      {con}

                    </li>

                  ))

                }

              </ul>

            </div>

          )

        }

        {

          recommendation.futureOutlook && (

            <div>

              <h4 className="font-semibold text-blue-400 mb-2">

                Future Outlook

              </h4>

              <p className="text-slate-300">

                {recommendation.futureOutlook}

              </p>

            </div>

          )

        }

      </div>

    </div>

  );

}