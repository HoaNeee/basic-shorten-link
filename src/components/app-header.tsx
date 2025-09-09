import React from "react";
import HeaderClient from "./header-client";

const AppHeader = () => {
	return (
		<header className="h-16 bg-white border-b border-b-gray-100 flex items-center px-4">
			<HeaderClient />
		</header>
	);
};

export default AppHeader;
