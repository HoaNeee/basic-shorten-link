import React from "react";
import { Skeleton } from "./ui/skeleton";

const CardItemLinkLoading = () => {
  return (
    <div className="bg-white/70 dark:bg-neutral-600 w-full py-2 rounded-sm shadow-xs">
      <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
        <div className="flex items-center flex-1 gap-4">
          <Skeleton className="aspect-square py-4" />
          <Skeleton className="w-1/3 py-4" />
        </div>
        <Skeleton className="w-1/8 py-4" />
      </div>
      <div className="px-8 py-5">
        <div className="flex flex-col gap-4">
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-1/3 h-3" />
        </div>
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="w-1/5 h-8" />
          <Skeleton className="w-1/8 h-6" />
        </div>
      </div>
    </div>
  );
};

export default CardItemLinkLoading;
