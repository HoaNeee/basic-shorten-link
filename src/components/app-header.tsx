import React from "react";
import HeaderClient from "./header-client";

const AppHeader = () => {
  return (
    <header className="dark:bg-black border-b-gray-100 dark:border-b-gray-400 flex items-center h-16 px-4 bg-white border-b">
      <HeaderClient />
    </header>
  );
};

export default AppHeader;
