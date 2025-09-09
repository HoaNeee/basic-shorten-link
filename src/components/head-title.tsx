import React from "react";

const HeadTitle = ({ title }: { title?: string }) => {
	return (
		<h2 className="text-2xl font-bold text-purple-800/80">
			{title || "Title"}
		</h2>
	);
};

export default HeadTitle;
