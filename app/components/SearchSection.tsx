export default function SearchSection() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-10">

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">

        <h3 className="text-2xl font-bold mb-2">
          Search Company
        </h3>

        <p className="text-slate-400 mb-8">
          Enter any listed company to begin AI-powered investment analysis.
        </p>

        <div className="space-y-6">

          {/* Company Name */}

          <div>
            <label className="block mb-2 text-sm text-slate-300">
              Company Name
            </label>

            <input
              type="text"
              placeholder="Example: Apple, Tesla, Infosys..."
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Market */}

          <div>
            <label className="block mb-2 text-sm text-slate-300">
              Stock Exchange
            </label>

            <select
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option>NSE</option>
              <option>BSE</option>
              <option>NASDAQ</option>
              <option>NYSE</option>
            </select>
          </div>

          {/* Analyze Button */}

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-4 font-semibold text-lg"
          >
            Analyze Company
          </button>

        </div>

      </div>

    </section>
  );
}