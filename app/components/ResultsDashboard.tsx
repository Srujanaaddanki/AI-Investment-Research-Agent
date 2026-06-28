import CompanyCard from "./CompanyCard";
import FinancialCard from "./FinancialCard";
import NewsCard from "./NewsCard";
import RiskCard from "./RiskCard";
import RecommendationCard from "./RecommendationCard";

interface ResultsDashboardProps {
  company: string;
}

export default function ResultsDashboard({
  company,
}: ResultsDashboardProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      <h2 className="text-4xl font-bold mb-10">
        AI Investment Report
      </h2>

      <div className="grid lg:grid-cols-2 gap-6">

        <CompanyCard company={company} />

        <FinancialCard />

      </div>

      <div className="mt-8">

        <NewsCard />

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <RiskCard />

        <RecommendationCard />

      </div>

    </section>
  );
}