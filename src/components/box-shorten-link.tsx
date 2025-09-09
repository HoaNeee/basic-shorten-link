import React from "react";
import { Button, ButtonTransition } from "./ui/button";

const BoxShortenLink = () => {
	return (
		<div className="flex items-center justify-center bg-gradient-to-r from-yellow-200 via-red-300 to-pink-300 w-full min-h-150 flex-col">
			<div className="py-10 flex flex-col items-center max-w-3xl w-full">
				<div className="flex items-center gap-2 text-4xl font-bold md:flex-row flex-col">
					<p className="italic">
						super<span>Link</span>
					</p>
					<span className="md:block hidden"> - </span>
					<p className="capitalize text-center">
						Shorten Link just one click away
					</p>
				</div>
				<div className="my-2 text-lg text-neutral-800 font-semibold">
					<p>
						Link shorten tool provided by{" "}
						<span className="underline">someone</span>
					</p>
				</div>
				<div className="mt-10 max-w-3xl w-full px-4">
					<form className="flex items-center gap-2 justify-center md:flex-row flex-col">
						<input
							type="text"
							placeholder="Enter your link"
							className="p-2 text-lg rounded-md bg-white border shadow-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent max-w-96 w-full"
							name="url"
						/>
						<ButtonTransition className="py-3" type="button">
							Shorten
						</ButtonTransition>
					</form>
				</div>
				{/* Fast view */}
				<div className="hidden mt-14 max-w-9/10 w-full">
					<div className="flex rounded-md items-center justify-between px-4 min-h-32 md:pb-0 pb-4 backdrop-blur-3xl w-full bg-white/20 md:flex-row flex-col">
						<div className="space-y-2 md:max-w-8/11 max-w-full w-full py-4 overflow-hidden">
							<p className="text-neutral-600 line-clamp-1 text-ellipsis overflow-hidden">
								https://www.google.com.vn/this/is/a/very/long/link/abc/def/ghi/jkl/mno/pqr/stu/vwx/yz
							</p>
							<p className="text-lg text-black line-clamp-1 text-ellipsis overflow-hidden">
								https://www.example.com/another/very/long/link/that/needs/to/be/shortened
							</p>
						</div>
						<div className="flex items-center gap-2">
							<button className="px-4 cursor-pointer py-1 text-sm bg-transparent border border-black rounded-md hover:bg-primary hover:text-white transition-colors">
								Copy
							</button>
							<Button variant={"link"}>statistics</Button>
						</div>
					</div>
					<div className="mt-3 text-center text-sm text-neutral-800 font-medium">
						<p>
							Do you want to shorten more another link or view detail
							statistics?{" "}
							<a href="#" className="italic hover:underline">
								Login now
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BoxShortenLink;
