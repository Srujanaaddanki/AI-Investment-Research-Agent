interface NewsItem {
  title: string;
  source: string;
  time: string;
}

const news: NewsItem[] = [
  {
    title: "AI Agent will fetch latest company news here.",
    source: "News API",
    time: "Just now",
  },
  {
    title: "Financial market updates will appear here.",
    source: "Yahoo Finance",
    time: "5 min ago",
  },
  {
    title: "Company announcements will appear here.",
    source: "Market News",
    time: "10 min ago",
  },
];

export default function NewsCard() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">

      <h3 className="text-2xl font-bold mb-6">
        Latest News
      </h3>

      <div className="space-y-5">

        {news.map((item, index) => (

          <div
            key={index}
            className="border-b border-slate-700 pb-4 last:border-none"
          >

            <h4 className="font-semibold">
              {item.title}
            </h4>

            <div className="flex justify-between text-sm text-slate-400 mt-2">

              <span>{item.source}</span>

              <span>{item.time}</span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}