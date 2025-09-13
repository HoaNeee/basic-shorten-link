import DashBoardPage from "@/components/dashboard-page";
import { get } from "@/lib/request";
import { cookies } from "next/headers";
import React from "react";

const getStatisticsLink = async () => {
	try {
		const token = (await cookies()).get("jwt_token")?.value;

		const response = await get(`/link/stats`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: "no-store",
		});

		return response as {
			total_view: number;
			total_link: number;
		};
	} catch (error) {
		return null;
	}
};

const Dashboard = async () => {
	const data = await getStatisticsLink();

	return <DashBoardPage data_statistic={data} />;
};

export default Dashboard;
