import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function getCompanyData(company: string) {
  try {
    // -----------------------------
    // Step 1 : Search company
    // -----------------------------
    const search: any = await yahooFinance.search(company);

    if (!search?.quotes?.length) {
      throw new Error("Company not found");
    }

    // -----------------------------
    // Step 2 : Pick best stock result
    // -----------------------------
    const bestMatch =
      search.quotes.find(
        (item: any) => item.quoteType === "EQUITY"
      ) ?? search.quotes[0];

    const symbol = bestMatch.symbol;

    // -----------------------------
    // Step 3 : Get live quote
    // -----------------------------
    const quote: any = await yahooFinance.quote(symbol);

    return {
      company: {
        name:
          quote.longName ??
          quote.shortName ??
          bestMatch.shortname ??
          company,

        symbol,

        exchange:
          quote.fullExchangeName ??
          bestMatch.exchange ??
          "N/A",

        sector:
          quote.sector ??
          "N/A",
      },

      financial: {
        price:
          quote.regularMarketPrice ?? null,

        currency:
          quote.currency ?? "USD",

        change:
          quote.regularMarketChangePercent ?? null,

        marketCap:
          quote.marketCap ?? null,

        peRatio:
          quote.trailingPE ?? null,

        eps:
          quote.epsTrailingTwelveMonths ?? null,

        high52Week:
          quote.fiftyTwoWeekHigh ?? null,

        low52Week:
          quote.fiftyTwoWeekLow ?? null,

        volume:
          quote.regularMarketVolume ?? null,
      },
    };
  } catch (error) {
    console.error("Yahoo Error:", error);

    throw error;
  }
}