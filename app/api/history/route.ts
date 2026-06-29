import { getHistoricalData } from "../../lib/history";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const range = searchParams.get("range") || "1Y";

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol parameter is required" },
        { status: 400 }
      );
    }

    const data = await getHistoricalData(symbol, range);

    return NextResponse.json({
      symbol,
      range,
      historicalData: data,
    });
  } catch (error: any) {
    console.error("API History Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
