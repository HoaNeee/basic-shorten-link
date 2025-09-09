import React from "react";

const AboutShortenLink = () => {
	const headContentAndContent = (head: string, content: string) => {
		return (
			<div className="space-y-4">
				<h3 className="font-bold text-xl">{head}</h3>
				<p className="text-lg text-justify">{content}</p>
			</div>
		);
	};

	return (
		<div className="py-10 max-w-7xl mx-auto">
			<h2 className="font-bold text-3xl text-center capitalize">
				superLink - Shorten Link just one click away
			</h2>
			<p className="my-6 text-lg text-justify px-4">
				superLink is a cutting-edge URL shortening service that allows users to
				easily convert long URLs into short, manageable links. With just one
				click, you can create a shortened link that is perfect for sharing on
				social media, in emails, or anywhere else you need a concise URL.
			</p>
			<div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-10 px-4">
				{headContentAndContent(
					"Easy to Use",
					"superLink is designed with simplicity in mind. Our user-friendly interface makes it easy for anyone to shorten URLs quickly and efficiently. Just paste your long URL into the input box, click the 'Shorten' button, and voila! You have a short link ready to share."
				)}
				{headContentAndContent(
					"Fast and Reliable",
					"superLink is designed with speed and reliability in mind. Our robust infrastructure ensures that your shortened links are created quickly and can handle high traffic without any issues. You can count on superLink to deliver your links promptly and efficiently."
				)}
			</div>
			<div className="mt-10 px-4">
				{headContentAndContent(
					"Secure and Private",
					"At superLink, we take your privacy seriously. Our URL shortening service does not track or store any personal information about our users. You can create and share shortened links with confidence, knowing that your data is safe and secure. We also offer options for password-protecting your links for added security. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
				)}
			</div>
		</div>
	);
};

export default AboutShortenLink;
