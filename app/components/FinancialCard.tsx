interface FinancialProps {
  financial: {
    price: number | null;
    currency: string;
    change: number | null;
    marketCap: number | null;
    peRatio: number | null;
    eps: number | null;
    high52Week: number | null;
    low52Week: number | null;
    volume: number | null;
  };
}

export default function FinancialCard({
  financial,
}: FinancialProps) {

  const formatNumber = (value: number | null) => {

    if (value === null || value === undefined)
      return "N/A";

    return value.toLocaleString();

  };

  return (

    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

      <h3 className="text-xl font-bold mb-6">

        Financial Summary

      </h3>

      <div className="space-y-4">

        <div className="flex justify-between">

          <span className="text-slate-400">
            Current Price
          </span>

          <span className="font-semibold">
            {financial.currency} {financial.price ?? "N/A"}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            Today's Change
          </span>

          <span
            className={
              financial.change !== null && financial.change >= 0
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {financial.change !== null
              ? `${financial.change.toFixed(2)}%`
              : "N/A"}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            Market Cap
          </span>

          <span>
            {formatNumber(financial.marketCap)}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            P/E Ratio
          </span>

          <span>
            {financial.peRatio ?? "N/A"}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            EPS
          </span>

          <span>
            {financial.eps ?? "N/A"}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            52 Week High
          </span>

          <span>
            {financial.high52Week ?? "N/A"}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            52 Week Low
          </span>

          <span>
            {financial.low52Week ?? "N/A"}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            Volume
          </span>

          <span>
            {formatNumber(financial.volume)}
          </span>

        </div>

      </div>

    </div>

  );

}