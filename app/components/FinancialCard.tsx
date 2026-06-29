interface FinancialProps {
  financial: {
    price: number;
    currency: string;
    marketCap: number;
    peRatio: number;
    eps: number;
  };
}

export default function FinancialCard({
  financial,
}: FinancialProps) {

  return (

    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

      <h3 className="text-xl font-bold mb-5">

        Financial Summary

      </h3>

      <div className="space-y-3">

        <div className="flex justify-between">

          <span className="text-slate-400">

            Current Price

          </span>

          <span>

            {financial.currency} {financial.price}

          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">

            Market Cap

          </span>

          <span>

            {financial.marketCap.toLocaleString()}

          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">

            P/E Ratio

          </span>

          <span>

            {financial.peRatio}

          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">

            EPS

          </span>

          <span>

            {financial.eps}

          </span>

        </div>

      </div>

    </div>

  );

}