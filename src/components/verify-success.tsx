"use client";

import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";

const VerifySuccess = () => {
	const searchParams = useSearchParams();
	const [second, setSecond] = useState(10);

	useEffect(() => {
		const interval = setInterval(() => {
			setSecond((prev) => {
				if (prev === 0) {
					window.location.href = `/login${
						searchParams.toString() ? `?${searchParams.toString()}` : ""
					}`;
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [second]);

	return (
		<Alert className="bg-green-50 text-green-700">
			<CheckCircle2Icon />
			<AlertTitle>Success! Your Account was be verified.</AlertTitle>
			<AlertDescription className="w-full">
				<div>
					You will be redirected to the{" "}
					<a
						href={`/login${
							searchParams.toString() ? `?${searchParams.toString()}` : ""
						}`}
						className="italic underline"
					>
						login
					</a>{" "}
					page in {second.toString().padStart(2, "0")} seconds.
				</div>
			</AlertDescription>
		</Alert>
	);
};

export default VerifySuccess;
