"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  visitors: { label: "Visitors" },
  bs: { label: "Business Suite", color: "hsl(var(--chart-1))" },
  ig: { label: "Instagram", color: "hsl(var(--chart-2))" },
};

export function AreaChartComponent() {
  const [chartData, setChartData] = React.useState([]);
  const [timeRange, setTimeRange] = React.useState("90d");
  const [loading, setLoading] = React.useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch data from your database
  React.useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch(`${backendUrl}/getReportData`);
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        const data = await response.json();
        const fetchedData = data.result;

        // Transform data to match chart expectations
        const transformedData = fetchedData
          .map((item) => ({
            date: item.date,
            bs: item.bs ?? 0,
            ig: item.ig ?? 0,
          }))
          .filter(
            (item) => (item.bs && item.bs !== 0) || (item.ig && item.ig !== 0)
          );

        setChartData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      }
    }

    fetchChartData();
  }, []);

  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];

    return chartData.filter((item) => {
      const date = new Date(item.date);
      // Use the latest date in the dataset as reference
      const dateArray = chartData.map((d) => new Date(d.date));
      const referenceDate = new Date(Math.max.apply(null, dateArray));

      let daysToSubtract =
        timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);

      return date >= startDate;
    });
  }, [chartData, timeRange]);

  const total = React.useMemo(
    () => ({
      bs: Array.isArray(filteredData)
        ? filteredData.reduce((acc, curr) => acc + (curr.bs || 0), 0)
        : 0,
      ig: Array.isArray(filteredData)
        ? filteredData.reduce((acc, curr) => acc + (curr.ig || 0), 0)
        : 0,
    }),
    [filteredData]
  );

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-4 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Real Data</CardTitle>
          <CardDescription>
            Showing total blasts for{" "}
            {timeRange === "90d"
              ? "the last 3 months"
              : timeRange === "30d"
              ? "the last 30 days"
              : "the last 7 days"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a time range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-2 sm:pt-2">
        <div className="mb-2 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-2 shadow-sm">
          <div className="flex flex-col items-center justify-center rounded-xl bg-background p-2 shadow">
            <p className="text-sm text-muted-foreground">BS Total</p>
            <p className="text-xl font-semibold text-foreground">
              {total.bs.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-background p-2 shadow">
            <p className="text-sm text-muted-foreground">IG Total</p>
            <p className="text-xl font-semibold text-foreground">
              {total.ig.toLocaleString()}
            </p>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillBs" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-bs)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-bs)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillIg" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ig)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ig)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="ig"
              type="natural"
              fill="url(#fillIg)"
              stroke="var(--color-ig)"
              stackId="a"
            />
            <Area
              dataKey="bs"
              type="natural"
              fill="url(#fillBs)"
              stroke="var(--color-bs)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
