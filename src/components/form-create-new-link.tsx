/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { LockKeyhole } from "lucide-react";
import { ButtonLoading } from "./ui/button";
import { toast } from "sonner";
import { post } from "@/lib/request";
import { useAuth } from "@/contexts/auth-context";

const FormCreateNewLink = ({ domain }: { domain?: string }) => {
	const { state: auth } = useAuth();

	const [domainState, setDomainState] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setDomainState(window.location.host);
		}
	}, []);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement> | any) => {
		e.preventDefault();
		const main_url = e.target[0].value as string;
		const domain = e.target[1].value as string;

		if (!main_url.trim()) {
			toast.error("Field Url must be required");
			return;
		}
		try {
			setLoading(true);
			const response = await post("/link/create", {
				main_url,
				domain,
				user_id: auth.user?.id,
			});
			window.location.href = `/user/link/${response.code}/stats`;
		} catch (error) {
			console.log(error);
			toast.error("Failure to create new link.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="flex flex-col max-w-3xl" onSubmit={onSubmit}>
			<div className="w-full space-y-2">
				<Label className="text-base font-medium">Enter your link here</Label>
				<Input
					className="w-full py-5"
					placeholder="https://example.com/very/long/url..."
					name="main_url"
				/>
			</div>

			<div className="mt-10 space-y-2">
				<h3 className="text-xl font-semibold">Short Link</h3>
				<Label className="inline-flex items-center gap-2 text-base font-normal">
					Domain <LockKeyhole size={14} />
				</Label>
				<Input
					className="md:max-w-1/2 w-full py-5"
					disabled
					value={domain || domainState || "https://example.com"}
				/>
			</div>
			<div className="flex justify-end mt-12">
				<ButtonLoading loading={loading} className="py-5">
					Shorten
				</ButtonLoading>
			</div>
		</form>
	);
};

export default FormCreateNewLink;
