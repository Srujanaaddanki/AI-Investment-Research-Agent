interface AgentCardProps {
  title: string;
  description: string;
  status: string;
}

export default function AgentCard({
  title,
  description,
  status,
}: AgentCardProps) {

  let badgeColor = "bg-slate-700";

  if (status === "Running...") {
    badgeColor = "bg-yellow-500 text-black";
  }

  if (status === "Completed") {
    badgeColor = "bg-green-600";
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">

      <div className="flex justify-between items-center">

        <h3 className="text-xl font-bold">
          {title}
        </h3>

        <span
          className={`${badgeColor} px-3 py-1 rounded-full text-sm font-semibold`}
        >
          {status}
        </span>

      </div>

      <p className="text-slate-400 mt-5">
        {description}
      </p>

    </div>
  );
}