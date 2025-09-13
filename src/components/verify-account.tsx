import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Button, ButtonLoading } from "./ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { getValueInLocalStorage } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import ResendOTPButton from "./resend-otp-button";

const VerifyAccount = ({
	setVerified,
}: {
	setVerified: (val: boolean) => void;
}) => {
	const { verifyAccount, cancelVerify, state } = useAuth();

	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);

	const email = getValueInLocalStorage("email_verifying");

	const onSubmit = async () => {
		setLoading(true);
		const success = await verifyAccount(email as string, code);
		if (success) {
			localStorage.removeItem("email_verifying");
			setVerified(true);
		}
		setLoading(false);
	};

	return (
		<div className="flex flex-col gap-4">
			<h3 className="text-2xl font-bold text-center text-green-700">
				Verification
			</h3>
			<div className="my-6">
				<p className="text-gray-500">
					Enter code, which we sent to your email.
				</p>
				<div className="my-6">
					<InputOTP
						maxLength={4}
						value={code}
						onChange={setCode}
						pattern={REGEXP_ONLY_DIGITS}
						onKeyDown={async (e) => {
							if (e.key === "Enter" && code.length === 4) {
								await onSubmit();
							}
						}}
					>
						<InputOTPGroup className="gap-4">
							{Array.from({ length: 4 }).map((_, index) => (
								<InputOTPSlot
									className="border-1 rounded-xs size-10 text-lg font-semibold"
									index={index}
									key={index}
								/>
							))}
						</InputOTPGroup>
					</InputOTP>

					{state.error ? (
						<span className="text-destructive block mt-4">
							Code Invalid, please try again
						</span>
					) : null}
				</div>
				<ResendOTPButton email={email as string} />
				<div className="flex items-center justify-end gap-2 px-4 mt-6">
					<Button
						variant={"outline"}
						onClick={() => {
							localStorage.removeItem("email_verifying");
							cancelVerify();
						}}
					>
						Previous
					</Button>
					<ButtonLoading
						loading={loading}
						disabled={code.length !== 4}
						onClick={onSubmit}
					>
						Finish
					</ButtonLoading>
				</div>
			</div>
		</div>
	);
};

export default VerifyAccount;
