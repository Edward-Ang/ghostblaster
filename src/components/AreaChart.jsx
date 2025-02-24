// components/Chart.jsx
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

const chartData = [
  { date: "2024-04-01", bs: 222, ig: 150 },
  { date: "2024-04-02", bs: 97, ig: 180 },
  { date: "2024-04-03", bs: 167, ig: 120 },
  { date: "2024-04-04", bs: 242, ig: 260 },
  { date: "2024-04-05", bs: 373, ig: 290 },
  { date: "2024-04-06", bs: 301, ig: 340 },
  { date: "2024-04-07", bs: 245, ig: 180 },
  { date: "2024-04-08", bs: 409, ig: 320 },
  { date: "2024-04-09", bs: 59, ig: 110 },
  { date: "2024-04-10", bs: 261, ig: 190 },
  { date: "2024-04-11", bs: 327, ig: 350 },
  { date: "2024-04-12", bs: 292, ig: 210 },
  { date: "2024-04-13", bs: 342, ig: 380 },
  { date: "2024-04-14", bs: 137, ig: 220 },
  { date: "2024-04-15", bs: 120, ig: 170 },
  { date: "2024-04-16", bs: 138, ig: 190 },
  { date: "2024-04-17", bs: 446, ig: 360 },
  { date: "2024-04-18", bs: 364, ig: 410 },
  { date: "2024-04-19", bs: 243, ig: 180 },
  { date: "2024-04-20", bs: 89, ig: 150 },
  { date: "2024-04-21", bs: 137, ig: 200 },
  { date: "2024-04-22", bs: 224, ig: 170 },
  { date: "2024-04-23", bs: 138, ig: 230 },
  { date: "2024-04-24", bs: 387, ig: 290 },
  { date: "2024-04-25", bs: 215, ig: 250 },
  { date: "2024-04-26", bs: 75, ig: 130 },
  { date: "2024-04-27", bs: 383, ig: 420 },
  { date: "2024-04-28", bs: 122, ig: 180 },
  { date: "2024-04-29", bs: 315, ig: 240 },
  { date: "2024-04-30", bs: 454, ig: 380 },
  { date: "2024-05-01", bs: 165, ig: 220 },
  { date: "2024-05-02", bs: 293, ig: 310 },
  { date: "2024-05-03", bs: 247, ig: 190 },
  { date: "2024-05-04", bs: 385, ig: 420 },
  { date: "2024-05-05", bs: 481, ig: 390 },
  { date: "2024-05-06", bs: 498, ig: 520 },
  { date: "2024-05-07", bs: 388, ig: 300 },
  { date: "2024-05-08", bs: 149, ig: 210 },
  { date: "2024-05-09", bs: 227, ig: 180 },
  { date: "2024-05-10", bs: 293, ig: 330 },
  { date: "2024-05-11", bs: 335, ig: 270 },
  { date: "2024-05-12", bs: 197, ig: 240 },
  { date: "2024-05-13", bs: 197, ig: 160 },
  { date: "2024-05-14", bs: 448, ig: 490 },
  { date: "2024-05-15", bs: 473, ig: 380 },
  { date: "2024-05-16", bs: 338, ig: 400 },
  { date: "2024-05-17", bs: 499, ig: 420 },
  { date: "2024-05-18", bs: 315, ig: 350 },
  { date: "2024-05-19", bs: 235, ig: 180 },
  { date: "2024-05-20", bs: 177, ig: 230 },
  { date: "2024-05-21", bs: 82, ig: 140 },
  { date: "2024-05-22", bs: 81, ig: 120 },
  { date: "2024-05-23", bs: 252, ig: 290 },
  { date: "2024-05-24", bs: 294, ig: 220 },
  { date: "2024-05-25", bs: 201, ig: 250 },
  { date: "2024-05-26", bs: 213, ig: 170 },
  { date: "2024-05-27", bs: 420, ig: 460 },
  { date: "2024-05-28", bs: 233, ig: 190 },
  { date: "2024-05-29", bs: 78, ig: 130 },
  { date: "2024-05-30", bs: 340, ig: 280 },
  { date: "2024-05-31", bs: 178, ig: 230 },
  { date: "2024-06-01", bs: 178, ig: 200 },
  { date: "2024-06-02", bs: 470, ig: 410 },
  { date: "2024-06-03", bs: 103, ig: 160 },
  { date: "2024-06-04", bs: 439, ig: 380 },
  { date: "2024-06-05", bs: 88, ig: 140 },
  { date: "2024-06-06", bs: 294, ig: 250 },
  { date: "2024-06-07", bs: 323, ig: 370 },
  { date: "2024-06-08", bs: 385, ig: 320 },
  { date: "2024-06-09", bs: 438, ig: 480 },
  { date: "2024-06-10", bs: 155, ig: 200 },
  { date: "2024-06-11", bs: 92, ig: 150 },
  { date: "2024-06-12", bs: 492, ig: 420 },
  { date: "2024-06-13", bs: 81, ig: 130 },
  { date: "2024-06-14", bs: 426, ig: 380 },
  { date: "2024-06-15", bs: 307, ig: 350 },
  { date: "2024-06-16", bs: 371, ig: 310 },
  { date: "2024-06-17", bs: 475, ig: 520 },
  { date: "2024-06-18", bs: 107, ig: 170 },
  { date: "2024-06-19", bs: 341, ig: 290 },
  { date: "2024-06-20", bs: 408, ig: 450 },
  { date: "2024-06-21", bs: 169, ig: 210 },
  { date: "2024-06-22", bs: 317, ig: 270 },
  { date: "2024-06-23", bs: 480, ig: 530 },
  { date: "2024-06-24", bs: 132, ig: 180 },
  { date: "2024-06-25", bs: 141, ig: 190 },
  { date: "2024-06-26", bs: 434, ig: 380 },
  { date: "2024-06-27", bs: 448, ig: 490 },
  { date: "2024-06-28", bs: 149, ig: 200 },
  { date: "2024-06-29", bs: 103, ig: 160 },
  { date: "2024-06-30", bs: 446, ig: 400 },
];

const chartConfig = {
  visitors: { label: "Visitors" },
  bs: { label: "Business Suite", color: "hsl(var(--chart-1))" },
  ig: { label: "Instagram", color: "hsl(var(--chart-2))" },
};

export function AreaChartCompenent() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
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
