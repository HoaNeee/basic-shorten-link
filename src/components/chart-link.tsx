"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "./ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { get } from "@/lib/request";
import { toast } from "sonner";

interface IChart {
	label: string;
	value: number;
}

const chartConfig = {
	value: {
		label: "view",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

interface Props {
	code: string;
	typeTime: "day" | "week" | "year" | "month";
	dateFrom: Date;
	dateTo: Date;
	className?: string;
	loading?: boolean;
	setLoading?: (val: boolean) => void;
}

const ChartLink = (props: Props) => {
	const { code, typeTime, dateFrom, dateTo, className, setLoading } = props;

	const [dataChart, setDataChart] = useState<IChart[]>([]);

	const getData = useCallback(async () => {
		try {
			setLoading?.(true);
			const response = await get(
				`/link/${code}/data-chart?typeTime=${typeTime}&dateFrom=${dateFrom.toLocaleDateString()}&dateTo=${dateTo.toLocaleDateString()}`
			);
			setDataChart(response);
		} catch (error) {
			console.log(error);
			toast.error("An occurred error fetch chart data");
		} finally {
			setLoading?.(false);
		}
	}, [code, typeTime, dateFrom, dateTo, setLoading]);

	useEffect(() => {
		getData();
	}, [getData]);

	return (
		<ChartContainer config={chartConfig} className={className}>
			<LineChart
				accessibilityLayer
				data={dataChart}
				margin={{
					left: 12,
					right: 12,
				}}
			>
				<CartesianGrid vertical={false} />

				<XAxis
					dataKey="label"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tickFormatter={(value) => value.slice(0, 5)}
				/>
				<YAxis dataKey={"value"} />
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Line
					dataKey="value"
					type="linear"
					stroke="var(--color-chart-1)"
					strokeWidth={2}
					dot={false}
				/>
				<ChartLegend content={<ChartLegendContent nameKey="value" />} />
			</LineChart>
		</ChartContainer>
	);
};

export default ChartLink;
