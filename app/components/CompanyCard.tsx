interface CompanyProps {
  company: {
    name: string;
    symbol: string;
    exchange: string;
    sector: string;
  };
}

export default function CompanyCard({
  company,
}: CompanyProps) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

      <h3 className="text-xl font-bold mb-6">
        Company Overview
      </h3>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-slate-400">
            Company
          </span>

          <span className="font-semibold">
            {company.name}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            Symbol
          </span>

          <span>
            {company.symbol}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            Exchange
          </span>

          <span>
            {company.exchange}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            Sector
          </span>

          <span>
            {company.sector}
          </span>
        </div>

      </div>

    </div>
  );
}