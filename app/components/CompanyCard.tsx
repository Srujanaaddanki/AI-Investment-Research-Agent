interface CompanyProps {
  company: {
    company: string;
    exchange: string;
    sector: string;
    country: string;
    employees: string;
  };
}

export default function CompanyCard({ company }: CompanyProps) {

  return (

    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

      <h3 className="text-xl font-bold mb-5">

        Company Overview

      </h3>

      <div className="space-y-3">

        <div className="flex justify-between">

          <span className="text-slate-400">

            Company

          </span>

          <span>

            {company.company}

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

        <div className="flex justify-between">

          <span className="text-slate-400">

            Country

          </span>

          <span>

            {company.country}

          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">

            Employees

          </span>

          <span>

            {company.employees}

          </span>

        </div>

      </div>

    </div>

  );

}