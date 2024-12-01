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

  // Fetch data from your database
  React.useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch("http://localhost:3001/getReportData"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        const data = await response.json();
        const fetchedData = data.result;

        // Transform data to match chart expectations
        const transformedData = fetchedData.map((item) => ({
          date: item.date,
          bs: item.bs || 0, // Replace `bs` with `bs`
          ig: item.ig || 0, // Replace `ig` with `ig`
        }));
        setChartData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      }
    }

    fetchChartData();
  }, []);

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
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>2024</CardTitle>
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
                className="relative w-40 z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
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
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
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
                  className="w-[150px]"
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
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
