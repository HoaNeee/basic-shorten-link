"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Calendar as CalenderIcon } from "lucide-react";
import moment from "moment";
import { Label } from "./ui/label";

const CalendarInput = ({
  date,
  setDate,
  label,
}: {
  date: Date;
  setDate: (val: Date) => void;
  label?: string | React.ReactNode;
}) => {
  const [month, setMonth] = useState<Date | undefined>();
  const [openCalenderPopover, setOpenCalenderPopover] = useState(false);

  function isValidDate(date: Date | undefined) {
    if (!date) {
      return false;
    }
    return !isNaN(date.getTime());
  }

  const now = Date.now();

  return (
    <div className="w-full space-y-2">
      {label ? (
        typeof label === "string" ? (
          <Label
            htmlFor={`date-picker-${label || now}`}
            className="dark:text-gray-300 text-base text-gray-500"
          >
            {label}
          </Label>
        ) : (
          label
        )
      ) : (
        <></>
      )}
      <div className="relative w-full">
        <Input
          id={`date-picker-${label || now}`}
          className="w-full [&::-webkit-calendar-picker-indicator]:hidden"
          type="date"
          onChange={(e) => {
            const date = new Date(e.target.value);
            if (isValidDate(date)) {
              setDate(date);
              setMonth(date);
            }
          }}
          value={moment(date).format("yyyy-MM-DD")}
        />

        <Popover
          open={openCalenderPopover}
          onOpenChange={setOpenCalenderPopover}
        >
          <PopoverTrigger className="top-1/2 right-2 absolute transform -translate-y-1/2">
            <CalenderIcon size={18} className="" />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={10}
            alignOffset={-8}
            className="w-auto overflow-hidden"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={(e) => {
                if (e && isValidDate(e)) {
                  setDate(e);
                  setOpenCalenderPopover(false);
                }
              }}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default CalendarInput;
