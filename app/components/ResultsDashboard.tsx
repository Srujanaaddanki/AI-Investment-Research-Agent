import CompanyCard from "./CompanyCard";
import FinancialCard from "./FinancialCard";
import NewsCard from "./NewsCard";
import RiskCard from "./RiskCard";
import RecommendationCard from "./RecommendationCard";

interface DashboardProps {
  data: any;
}

export default function ResultsDashboard({
  data,
}: DashboardProps) {

  if (!data) return null;

  return (

    <section className="max-w-7xl mx-auto px-6 py-16">

      <h2 className="text-4xl font-bold mb-8">

        AI Investment Report

      </h2>

      <div className="grid lg:grid-cols-2 gap-6">

        <CompanyCard
          company={data.company}
        />

        <FinancialCard
          financial={data.financial}
        />

      </div>

      <div className="mt-8">

        <NewsCard
          news={data.news}
        />

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <RiskCard
          risk={data.risk}
        />

        <RecommendationCard
          recommendation={data.recommendation}
        />

      </div>

    </section>

  );

}