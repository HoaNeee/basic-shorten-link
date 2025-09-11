import React from "react";

const HeadTitle = ({ title }: { title?: string }) => {
  return (
    <h2 className="text-purple-800/80 dark:text-purple-600 text-2xl font-bold">
      {title || "Title"}
    </h2>
  );
};

export default HeadTitle;
