import yahooFinance from "yahoo-finance2";

export async function getCompanyData(symbol: string) {
  try {
    const quote: any = await yahooFinance.quote(symbol);

    return {
      name: quote.longName || quote.shortName || symbol,
      exchange: quote.fullExchangeName || "Unknown",
      sector: quote.sector || "Technology",
      ceo: "N/A",
      country: "USA",
      employees: "N/A",

      financial: {
        price: quote.regularMarketPrice ?? 0,
        currency: quote.currency ?? "USD",
        marketCap: quote.marketCap ?? 0,
        peRatio: quote.trailingPE ?? 0,
        eps: quote.epsTrailingTwelveMonths ?? 0,
      },
    };
  } catch (error) {
    console.error("Yahoo Finance Error:", error);

    return {
      name: symbol,
      exchange: "Unknown",
      sector: "Unknown",
      ceo: "Unknown",
      country: "Unknown",
      employees: "Unknown",

      financial: {
        price: 0,
        currency: "USD",
        marketCap: 0,
        peRatio: 0,
        eps: 0,
      },
    };
  }
}