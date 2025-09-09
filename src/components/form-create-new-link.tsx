/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { LockKeyhole } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const FormCreateNewLink = () => {
	const [domain, setDomain] = useState("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			setDomain(window.location.host);
		}
	}, []);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement> | any) => {
		e.preventDefault();
		const value = e.target[0].value as string;
		if (!value.trim()) {
			toast.error("Field Url must be required");
			return;
		}
		console.log(value);
	};

	return (
		<form className="flex flex-col max-w-3xl" onSubmit={onSubmit}>
			<div className="space-y-2 w-full">
				<Label className="font-medium text-base">Enter your link here</Label>
				<Input
					className="w-full py-5"
					placeholder="https://example.com/very/long/url..."
					name="main_url"
				/>
			</div>

			<div className="mt-10 space-y-2">
				<h3 className="text-xl font-semibold">Short Link</h3>
				<Label className="font-normal text-base inline-flex items-center gap-2">
					Domain <LockKeyhole size={14} />
				</Label>
				<Input
					className="w-full md:max-w-1/2 py-5"
					disabled
					value={domain || "https://example.com"}
				/>
			</div>
			<div className="mt-12 flex justify-end">
				<Button>Shorten</Button>
			</div>
		</form>
	);
};

export default FormCreateNewLink;
