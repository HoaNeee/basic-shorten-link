import AboutShortenLink from "@/components/about-shorten-link";
import BoxShortenLink from "@/components/box-shorten-link";
import React from "react";

const Home = () => {
	return (
		<div className="w-full h-full">
			<BoxShortenLink />
			<AboutShortenLink />
		</div>
	);
};

export default Home;
