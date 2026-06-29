interface NewsProps {
  news: {
    title: string;
    source: string;
    published: string;
  }[];
}

export default function NewsCard({
  news,
}: NewsProps) {

  return (

    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

      <h3 className="text-xl font-bold mb-6">

        Latest News

      </h3>

      <div className="space-y-5">

        {news.map((item, index) => (

          <div
            key={index}
            className="border-b border-slate-700 pb-4"
          >

            <h4 className="font-semibold">

              {item.title}

            </h4>

            <div className="flex justify-between text-sm text-slate-400 mt-2">

              <span>

                {item.source}

              </span>

              <span>

                {item.published}

              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}