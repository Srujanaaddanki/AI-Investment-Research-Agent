"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts to disable SSR for this component
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StockChartProps {
  symbol: string;
  initialData: any[];
  currency: string;
}

export default function StockChart({
  symbol,
  initialData,
  currency,
}: StockChartProps) {
  const [range, setRange] = useState<string>("1Y");
  const [chartType, setChartType] = useState<"line" | "candlestick">("line");
  const [chartData, setChartData] = useState<any[]>(initialData || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if symbol or initialData changes
  useEffect(() => {
    setRange("1Y");
    setChartData(initialData || []);
    setError(null);
  }, [symbol, initialData]);

  // Fetch range data (wrapped in useCallback so we can call it in Retry)
  const fetchRangeData = useCallback(async (selectedRange: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/history?symbol=${symbol}&range=${selectedRange}`);
      if (!res.ok) {
        throw new Error(`Failed to load data (HTTP ${res.status})`);
      }
      const result = await res.json();
      if (result.error) {
        throw new Error(result.error);
      }
      if (result.historicalData) {
        setChartData(result.historicalData);
      } else {
        throw new Error("No data returned from market provider");
      }
    } catch (err: any) {
      console.error("Error fetching historical range data:", err);
      setError(err.message || "Failed to load market chart data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  // Trigger fetch when range changes (skipping initial 1Y if we have initialData)
  useEffect(() => {
    if (range === "1Y" && initialData && initialData.length > 0) {
      setChartData(initialData);
      setError(null);
      return;
    }
    fetchRangeData(range);
  }, [range, initialData, fetchRangeData]);

  // Retry action
  const handleRetry = () => {
    fetchRangeData(range);
  };

  // Calculate range statistics
  const hasData = chartData && chartData.length > 0 && !error;
  const startPrice = hasData ? chartData[0].close : 0;
  const endPrice = hasData ? chartData[chartData.length - 1].close : 0;
  const changeValue = endPrice - startPrice;
  const changePercent = startPrice > 0 ? (changeValue / startPrice) * 100 : 0;
  const isPositive = changeValue >= 0;

  // Prepare Series for ApexCharts
  const priceSeriesData = chartData.map((item) => {
    const timestamp = new Date(item.date).getTime();
    if (chartType === "line") {
      return { x: timestamp, y: Number(item.close.toFixed(2)) };
    } else {
      return {
        x: timestamp,
        y: [
          Number(item.open.toFixed(2)),
          Number(item.high.toFixed(2)),
          Number(item.low.toFixed(2)),
          Number(item.close.toFixed(2)),
        ],
      };
    }
  });

  const volumeSeriesData = chartData.map((item) => ({
    x: new Date(item.date).getTime(),
    y: item.volume,
  }));

  const series = [
    {
      name: "Price",
      type: chartType === "line" ? "area" : "candlestick",
      data: priceSeriesData,
    },
    {
      name: "Volume",
      type: "bar",
      data: volumeSeriesData,
    },
  ];

  // ApexCharts Options configuration
  const options: any = {
    chart: {
      id: "stock-price-chart",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      foreColor: "#94a3b8", // slate-400
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: chartType === "line" ? [2, 0] : [1, 0],
    },
    fill: {
      type: chartType === "line" ? ["gradient", "solid"] : ["solid", "solid"],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    colors: chartType === "line" ? ["#06b6d4", "#475569"] : ["#10b981", "#475569"], // Cyan for line, Emerald/default for candlestick, Slate for volume
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#10b981", // Emerald-500
          downward: "#ef4444", // Red-500
        },
        wick: {
          useFillColor: true,
        },
      },
      bar: {
        columnWidth: "60%",
        colors: {
          ranges: [
            {
              from: 0,
              to: Number.MAX_VALUE,
              color: "#334155", // slate-700 for volume bars
            },
          ],
        },
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
        style: {
          colors: "#94a3b8",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: [
      {
        seriesName: "Price",
        title: {
          text: "Price",
          style: {
            color: "#94a3b8",
          },
        },
        labels: {
          style: {
            colors: "#94a3b8",
          },
          formatter: (val: number) => {
            if (val === null || val === undefined) return "";
            return `${currency} ${val.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      {
        seriesName: "Volume",
        opposite: true,
        show: false, // Keep secondary axis labels hidden to clean up view
        max: (maxVal: number) => {
          return maxVal * 4.5; // Scale volume to stay in the bottom 22% of chart area
        },
      },
    ],
    grid: {
      borderColor: "#334155", // slate-700
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "dark",
      x: {
        formatter: (val: number) => {
          return new Date(val).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: range === "1D" || range === "5D" ? "short" : undefined,
          });
        },
      },
      y: [
        {
          formatter: (val: number) => {
            if (val === null || val === undefined) return "";
            return `${currency} ${val.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
        {
          formatter: (val: number) => {
            if (val === null || val === undefined) return "";
            return val.toLocaleString();
          },
        },
      ],
    },
    legend: {
      show: false,
    },
  };

  const ranges = ["1D", "5D", "1M", "3M", "6M", "1Y", "5Y"];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-4 md:p-6 shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Top Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Chart
            </span>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {symbol} Price Analysis
            </h3>
          </div>
          {hasData && (
            <div className="mt-1 flex items-baseline gap-2 flex-wrap">
              <span className="text-xl md:text-2xl font-bold text-white">
                {currency} {endPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`text-xs md:text-sm font-semibold flex items-center ${
                  isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {isPositive ? "▲" : "▼"} {Math.abs(changeValue).toFixed(2)} (
                {isPositive ? "+" : ""}
                {changePercent.toFixed(2)}%)
              </span>
              <span className="text-[10px] md:text-xs text-slate-500">
                over {range}
              </span>
            </div>
          )}
        </div>

        {/* Controls (Responsive wrapping) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Toggles */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setChartType("line")}
              className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                chartType === "line"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType("candlestick")}
              className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                chartType === "candlestick"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Candle
            </button>
          </div>

          {/* Time Ranges */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 overflow-x-auto max-w-full">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  range === r
                    ? "bg-slate-800 text-cyan-400 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="min-h-[300px] md:min-h-[360px] w-full flex items-center justify-center relative">
        {loading ? (
          /* Better Loading Skeleton */
          <div className="w-full h-[300px] md:h-[360px] flex flex-col justify-between animate-pulse p-2">
            <div className="flex-1 w-full relative flex flex-col justify-end">
              {/* Grid lines skeleton */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-t border-slate-700 w-full h-px"></div>
                <div className="border-t border-slate-700 w-full h-px"></div>
                <div className="border-t border-slate-700 w-full h-px"></div>
                <div className="border-t border-slate-700 w-full h-px"></div>
              </div>
              
              {/* Pulsing svg path */}
              <svg className="w-full h-40 text-slate-800 opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M0,70 L10,65 L20,40 L30,55 L40,30 L50,45 L60,15 L70,35 L80,20 L90,50 L100,25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Volume bars skeleton at the bottom */}
              <div className="h-12 w-full flex items-end gap-1.5 opacity-15 mt-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-slate-700 rounded-t w-full"
                    style={{ height: `${Math.max(10, Math.sin(i * 0.4) * 35 + 45)}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          /* Error State Card */
          <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-950/40 rounded-2xl border border-red-500/20 max-w-md mx-auto my-4 transition-all duration-300">
            <div className="text-red-400 text-3xl mb-3">⚠️</div>
            <h4 className="text-white font-bold mb-1.5 text-sm md:text-base">Chart Data Unavailable</h4>
            <p className="text-slate-400 text-[11px] md:text-xs mb-5 leading-relaxed">{error}</p>
            <button
              onClick={handleRetry}
              className="px-5 py-2 bg-slate-800 text-cyan-400 hover:text-white hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-md active:scale-95"
            >
              Retry Fetch
            </button>
          </div>
        ) : hasData ? (
          /* Chart display */
          <div className="w-full">
            <Chart
              options={options}
              series={series}
              type={chartType === "line" ? "area" : "candlestick"}
              height={chartType === "line" ? 360 : 360}
            />
          </div>
        ) : (
          <div className="text-slate-400 text-xs md:text-sm">
            No historical price data available for {symbol}.
          </div>
        )}
      </div>
    </div>
  );
}
