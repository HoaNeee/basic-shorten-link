import { TLink } from "@/types/link.types";
import React from "react";
import CardItemLink from "./card-item-link";
import CardItemLinkLoading from "./card-item-link-loading";
import { ChartLineLink } from "./chart-link";

const StatisticDetailPage = ({ link }: { link: TLink }) => {
  if (!link) {
    return (
      <div className="dark:bg-black p-6 bg-gray-100">
        <CardItemLinkLoading />
      </div>
    );
  }

  if (typeof link === "string") {
    return <div className="p-6">{link}</div>;
  }

  return (
    <div className="dark:bg-black w-full h-full bg-gray-100">
      <div className="flex flex-col p-6">
        <CardItemLink link={link} isStatistic />
        <div className="flex-1 mt-6">
          <ChartLineLink />
        </div>
      </div>
    </div>
  );
};

export default StatisticDetailPage;
