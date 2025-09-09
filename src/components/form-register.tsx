/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { FaGoogle } from "react-icons/fa";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/auth-context";

import VerifyAccount from "./verify-account";
import VerifySuccess from "./verify-success";

const registerFormSchema = z.object({
	fullname: z.string().min(0),
	email: z.email(),
	username: z
		.string()
		.min(1, {
			error: "Please enter this field",
		})
		.regex(/^[a-zA-Z0-9]{3,}$/, "Invalid username"),
	password: z.string().min(1, {
		error: "Please enter this field",
	}),
	rePassword: z.string().min(1, {
		error: "Please enter this field",
	}),
});

const FormRegister = () => {
	const { register, state } = useAuth();
	const [verified, setVerified] = useState(false);

	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			fullname: "",
			password: "",
			username: "",
			email: "",
			rePassword: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
		if (values.rePassword !== values.password) {
			form.setError("rePassword", {
				message: "Repeat password doesn't not match",
			});
			return;
		}

		await register(
			values.email,
			values.password,
			values.username,
			values.fullname
		);
	};

	if (verified) {
		return <VerifySuccess />;
	}

	if (state.user && state.user.status === "inactive") {
		return <VerifyAccount setVerified={setVerified} />;
	}

	return (
		<div className="flex flex-col gap-4">
			<h3 className="text-2xl text-green-700 text-center font-bold">Sign Up</h3>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							onSubmit(form.getValues());
						}
					}}
				>
					<FormField
						control={form.control}
						name="fullname"
						render={({ field }) => {
							return (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Enter your full name"
											type="text"
											className="py-5 rounded-xs"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => {
							return (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Enter email here"
											type="text"
											className="py-5 rounded-xs"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => {
							return (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Enter username here"
											type="text"
											className="py-5 rounded-xs"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => {
							return (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Enter your password here"
											type="password"
											className="py-5 rounded-xs"
											autoComplete="new-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="rePassword"
						render={({ field }) => {
							return (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Enter your password here"
											type="password"
											className="py-5 rounded-xs"
											autoComplete="re-new-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				</form>
			</Form>
			<div className="relative w-full my-4 h-[1px] bg-gray-200">
				<div className="absolute -top-3 flex items-center justify-center w-full left-0">
					<span className="bg-white px-2 text-gray-500 font-semibold">Or</span>
				</div>
			</div>
			<button className="bg-red-100/80 text-red-600 py-2 px-4 rounded-sm hover:text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-4 font-medium cursor-pointer">
				<FaGoogle size={18} />
				Login in with Google
			</button>
			<p className="mt-2">
				Already have an account?{" "}
				<a href="/login" className="text-cyan-700 hover:text-cyan-600">
					Login
				</a>
			</p>
			<div className="flex items-center justify-end">
				<Button onClick={form.handleSubmit(onSubmit)}>Next</Button>
			</div>
		</div>
	);
};

export default FormRegister;
