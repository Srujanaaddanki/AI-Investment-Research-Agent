interface CompanyCardProps {
  company: string;
}

export default function CompanyCard({
  company,
}: CompanyCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">

      <h3 className="text-2xl font-bold mb-6">
        Company Overview
      </h3>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-slate-400">Company</span>
          <span className="font-semibold">{company}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Sector</span>
          <span>Technology</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">CEO</span>
          <span>Loading...</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Country</span>
          <span>USA</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Exchange</span>
          <span>NASDAQ</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Employees</span>
          <span>Loading...</span>
        </div>

      </div>

    </div>
  );
}