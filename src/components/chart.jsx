"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme hook

const chartConfig = {
  views: {
    label: "Total Blast",
  },
  bs: {
    label: "Business Suite",
    color: "hsl(var(--chart-7))",
  },
  ig: {
    label: "Instagram",
    color: "hsl(var(--chart-2))",
  },
};

export function Chart() {
  const [chartData, setChartData] = React.useState([]);
  const [activeChart, setActiveChart] = React.useState("bs");
  const [loading, setLoading] = React.useState(true);
  const userId = localStorage.getItem("userId");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { theme } = useTheme(); // Get the current theme

  // Fetch data from your database
  React.useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch(`${backendUrl}/report/getAllUserReport`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        const data = await response.json();
        // Transform data to match chart expectations
        const transformedData = data
          .map((item) => ({
            date: item.date,
            bs: item.businessSuite ?? 0, // Ensure `bs` is 0 if null/undefined
            ig: item.instagram ?? 0, // Ensure `ig` is 0 if null/undefined
          }))
          .filter(
            (item) => (item.bs && item.bs !== 0) || (item.ig && item.ig !== 0)
          ); // Remove zero/null values

        setChartData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      }
    }

    fetchChartData();
  }, []);

  const filteredChartData = React.useMemo(() => {
    return chartData.filter((item) => {
      if (activeChart === "bs") {
        return item.bs > 0; // Show only if `bs` is greater than 0
      }
      if (activeChart === "ig") {
        return item.ig > 0; // Show only if `ig` is greater than 0
      }
      return true;
    });
  }, [chartData, activeChart]);

  const total = React.useMemo(
    () => ({
      bs: Array.isArray(chartData)
        ? chartData.reduce((acc, curr) => acc + (curr.bs || 0), 0)
        : 0,
      ig: Array.isArray(chartData)
        ? chartData.reduce((acc, curr) => acc + (curr.ig || 0), 0)
        : 0,
    }),
    [chartData]
  );

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  return (
    <Card
      className={`${
        theme === "dark"
          ? "border-[var(--border-dark-card)] bg-[var(--bg-dark-card)]"
          : ""
      }`}
    >
      <CardHeader
        className={`flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row ${
          theme === "dark"
            ? "border-[var(--border-dark-card)] rounded-t-xl"
            : ""
        }`}
      >
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>2025</CardTitle>
          <CardDescription>
            Showing total blast for each day in this year
          </CardDescription>
        </div>
        <div className="flex">
          {["bs", "ig"].map((key) => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className={`relative w-40 z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 ${
                  theme === "dark"
                    ? "border-[var(--border-dark-card)] data-[active=true]:bg-[var(--bg-dark-card-hover)]"
                    : ""
                }`}
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 rounded-xl">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid
              vertical={false}
              stroke={
                theme === "dark" ? "var(--border-dark-card)" : "var(--border)"
              }
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className={`w-[150px] ${
                    theme === "dark"
                      ? "bg-[var(--bg-dark-card)] border-[var(--border-dark-card)]"
                      : ""
                  }`}
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
              activeBar={{ fillOpacity: 0.9 }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
