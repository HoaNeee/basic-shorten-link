"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import CalendarInput from "./calendar-input";
import { useState } from "react";
import { ButtonLoading } from "./ui/button";
import moment from "moment";
import ChartLink from "./chart-link";

export const description = "A linear line chart";

type TypeTime = "week" | "year" | "month" | "day";

export function ChartLineLinkLayout({ code }: { code: string }) {
  const [dateFrom, setDateFrom] = useState<Date>(
    new Date(moment(new Date()).subtract(6, "day").format())
  );
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [typeTime, setTypeTime] = useState<TypeTime>("day");
  const [state, setState] = useState<{
    typeTime: "week" | "year" | "month" | "day";
    dateFrom: Date;
    dateTo: Date;
  }>({
    typeTime: "day",
    dateFrom: new Date(moment(new Date()).subtract(6, "day").format()),
    dateTo: new Date(),
  });
  const [loading, setLoading] = useState(false);

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
          <ButtonLoading
            className=""
            title="Apply to filter"
            onClick={() => {
              setState({
                typeTime,
                dateFrom,
                dateTo,
              });
            }}
            loading={loading}
          >
            Apply
          </ButtonLoading>
        </div>
      </CardHeader>
      <CardContent>
        <ChartLink
          code={code}
          dateFrom={state.dateFrom}
          dateTo={state.dateTo}
          typeTime={state.typeTime}
          loading={loading}
          setLoading={setLoading}
        />
      </CardContent>
    </Card>
  );
}
