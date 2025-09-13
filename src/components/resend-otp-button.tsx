/* eslint-disable @typescript-eslint/no-explicit-any */
import { isProduction } from "@/lib/contant";
import { post } from "@/lib/request";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ResendOTPButton = ({ email }: { email: string }) => {
	const [resent, setResent] = useState(false);
	const [second, setSecond] = useState(isProduction ? 0 : 10);
	const [minute, setMinute] = useState(isProduction ? 3 : 0);

	useEffect(() => {
		let interval: any = null;

		if (resent) {
			interval = setInterval(() => {
				if (second === 0) {
					if (minute === 0) {
						setResent(false);
						clearInterval(interval);
					} else {
						setSecond(59);
						setMinute((prev) => prev - 1);
					}
				} else {
					setSecond((prev) => prev - 1);
				}
			}, 1000);
		} else {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [second, minute, resent]);

	const handleResent = async () => {
		toast.promise(
			async () => {
				if (isProduction) {
					setMinute(3);
				} else {
					setSecond(10);
				}
				setResent(true);
				await post("/auth/resent-otp", { email });
			},
			{
				loading: "Loading...",
				success: "OTP was be sent to your email",
				error: (error) => {
					return error.message || error;
				},
			}
		);
	};

	return (
		<div className="text-gray-500">
			<span>{"Don't"} get the code? </span>
			{resent ? (
				<span className="text-gray-400 cursor-not-allowed">
					Send again ({minute.toString().padStart(2, "0")}:
					{second.toString().padStart(2, "0")})
				</span>
			) : (
				<span className="text-cyan-600 cursor-pointer" onClick={handleResent}>
					Send again
				</span>
			)}
		</div>
	);
};

export default ResendOTPButton;
