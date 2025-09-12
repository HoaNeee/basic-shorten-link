"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
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
} from "./ui/select";
import { Label } from "./ui/label";
import CalendarInput from "./calendar-input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const description = "A linear line chart";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type TypeTime = "week" | "year" | "month" | "day";

export function ChartLineLink() {
  const [dateFrom, setDateFrom] = useState<Date>(new Date());
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [typeTime, setTypeTime] = useState<TypeTime>("day");

  const handleApply = async () => {
    console.log(typeTime);
  };

  return (
    <Card>
      <CardHeader>
        <div className="md:grid-cols-3 sm:grid-cols-2 md:gap-10 grid gap-5">
          <div className="w-full space-y-2">
            <Label className="dark:text-gray-300 text-base text-gray-500">
              Scale
            </Label>
            <Select
              value={typeTime}
              onValueChange={(e) => {
                setTypeTime(e as TypeTime);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CalendarInput
            date={dateFrom}
            setDate={setDateFrom}
            label="DateFrom"
          />
          <CalendarInput date={dateTo} setDate={setDateTo} label="DateTo" />
        </div>
        <div className="text-end my-2">
          <Button className="" title="Apply to filter" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis dataKey={"desktop"} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="linear"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent nameKey="desktop" />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="w-4 h-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
