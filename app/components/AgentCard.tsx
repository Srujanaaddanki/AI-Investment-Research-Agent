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

  const color =
    status === "Running..."
      ? "bg-yellow-500 text-black"
      : "bg-slate-700 text-white";

  return (

    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-blue-500 transition">

      <div className="flex justify-between items-center mb-4">

        <h3 className="text-2xl font-semibold">
          {title}
        </h3>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}
        >
          {status}
        </span>

      </div>

      <p className="text-slate-400">
        {description}
      </p>

    </div>

  );
}