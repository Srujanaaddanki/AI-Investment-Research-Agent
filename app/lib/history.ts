import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function getHistoricalData(symbol: string, range: string = "1Y") {
  try {
    const endDate = new Date();
    const startDate = new Date();
    let interval: "5m" | "15m" | "30m" | "1h" | "1d" | "1wk" | "1mo" = "1d";

    const normalizedRange = range.toUpperCase();

    if (normalizedRange === "1D") {
      startDate.setDate(endDate.getDate() - 4); // 4 days ago to ensure we have data (esp. over weekends)
      interval = "15m";
    } else if (normalizedRange === "5D") {
      startDate.setDate(endDate.getDate() - 8); // 8 days to cover weekend
      interval = "30m";
    } else if (normalizedRange === "1M") {
      startDate.setDate(endDate.getDate() - 30);
      interval = "1d";
    } else if (normalizedRange === "3M") {
      startDate.setDate(endDate.getDate() - 90);
      interval = "1d";
    } else if (normalizedRange === "6M") {
      startDate.setDate(endDate.getDate() - 180);
      interval = "1d";
    } else if (normalizedRange === "1Y") {
      startDate.setDate(endDate.getDate() - 365);
      interval = "1d";
    } else if (normalizedRange === "5Y") {
      startDate.setDate(endDate.getDate() - 5 * 365);
      interval = "1d";
    }

    const result = await yahooFinance.chart(symbol, {
      period1: startDate,
      period2: endDate,
      interval: interval,
    });

    const quotes = result.quotes || [];

    let filteredQuotes = quotes.filter(
      (item: any) => item.date && item.close !== null && item.close !== undefined
    );

    if (normalizedRange === "1D" && filteredQuotes.length > 0) {
      const lastQuoteDate = new Date(filteredQuotes[filteredQuotes.length - 1].date);
      const lastLocalDateString = lastQuoteDate.toDateString();
      filteredQuotes = filteredQuotes.filter((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate.toDateString() === lastLocalDateString;
      });
    }

    return filteredQuotes.map((item: any) => ({
      date: item.date,
      open: item.open ?? item.close,
      high: item.high ?? item.close,
      low: item.low ?? item.close,
      close: item.close,
      volume: item.volume ?? 0,
    }));
  } catch (error) {
    console.error("History Error:", error);
    return [];
  }
}