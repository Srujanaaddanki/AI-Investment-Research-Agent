export default function FinancialCard() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">

      <h3 className="text-2xl font-bold mb-6">
        Financial Summary
      </h3>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-slate-400 text-sm">Current Price</p>
          <p className="text-2xl font-bold">$--</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Market Cap</p>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">P/E Ratio</p>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">EPS</p>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Revenue</p>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Dividend Yield</p>
          <p className="text-2xl font-bold">--</p>
        </div>

      </div>

    </div>
  );
}