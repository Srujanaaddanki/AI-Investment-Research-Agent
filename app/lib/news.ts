import axios from "axios";

export async function getLatestNews(company: string) {
  try {
    const response = await axios.get(
      "https://newsapi.org/v2/everything",
      {
        params: {
          q: company,
          language: "en",
          pageSize: 5,
          sortBy: "publishedAt",
          apiKey: process.env.NEWS_API_KEY,
        },
      }
    );

    return response.data.articles.map((article: any) => ({
      title: article.title,
      source: article.source.name,
      published: new Date(article.publishedAt).toLocaleDateString(),
      url: article.url,
    }));
  } catch (error) {
    console.error("News API Error:", error);

    return [
      {
        title: `No recent news found for ${company}.`,
        source: "NewsAPI",
        published: "Today",
        url: "#",
      },
    ];
  }
}