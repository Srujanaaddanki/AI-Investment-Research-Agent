type AgentCardProps = {
  title: string;
  description: string;
  status: string;
};

export default function AgentCard({
  title,
  description,
  status,
}: AgentCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-blue-500 transition">

      <div className="flex justify-between items-center">

        <h3 className="text-xl font-semibold">
          {title}
        </h3>

        <span className="text-sm bg-slate-800 px-3 py-1 rounded-full">
          {status}
        </span>

      </div>

      <p className="text-slate-400 mt-4">
        {description}
      </p>

    </div>
  );
}