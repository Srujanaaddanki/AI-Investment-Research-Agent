export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            AI Investment Research Agent
          </h1>

          <p className="text-sm text-slate-400">
            Multi-Agent Investment Analysis Platform
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-400">
            Powered by AI Agents
          </p>
        </div>
      </div>
    </header>
  );
}