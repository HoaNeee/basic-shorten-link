/* eslint-disable @typescript-eslint/no-explicit-any */
import StatisticDetailPage from "@/components/statistic-detail-page";
import { get } from "@/lib/request";
import { cookies } from "next/headers";
import React from "react";

const getLinkDetail = async (code: string) => {
  try {
    const token = (await cookies()).get("jwt_token")?.value;

    const response = await get(`/link/${code}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (e: any) {
    return e.message || e;
  }
};

const StatisticDetailLink = async ({
  params,
}: {
  params: Promise<{ code: string }>;
}) => {
  const { code } = await params;

  const link = await getLinkDetail(code);

  return <StatisticDetailPage link={link} />;
};

export default StatisticDetailLink;
