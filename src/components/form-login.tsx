/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "@/contexts/auth-context";

const accountSchema = z.union([
	z.email(),
	z.string().regex(/^[a-zA-Z0-9]{3,}$/, "Invalid username"),
]);

const loginFormSchema = z.object({
	account: z.string().min(1, {
		error: "Please enter this field",
	}),
	password: z.string().min(1, {
		error: "Please enter this field",
	}),
});

const FormLogin = () => {
	const { login } = useAuth();
	const [isRemember, setIsRemember] = useState(false);

	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			account: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
		const safe = accountSchema.safeParse(values.account);
		if (!safe.success) {
			form.setError("account", {
				message: "Invalid email address or username",
			});
			return;
		}
		await login(values.account, values.password, isRemember);
	};

	return (
		<div className="flex flex-col gap-4">
			<h3 className="text-2xl text-green-700 text-center font-bold">Login</h3>
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
						name="account"
						render={({ field }) => {
							return (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Enter email/username here"
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
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>

					<div className="flex w-full justify-between items-center my-5">
						<div className="flex items-center gap-2">
							<Checkbox
								checked={isRemember}
								onCheckedChange={(e) => {
									setIsRemember(e as boolean);
								}}
								id="isRemember"
							/>
							<Label htmlFor="isRemember">Remember Me</Label>
						</div>
						<a
							href="/forgot-password"
							className="text-sm text-cyan-700 hover:text-cyan-600"
						>
							Forgot password?
						</a>
					</div>

					<Button className="w-full py-5 rounded-sm">Login</Button>
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
			<p className="mt-4">
				{"Don't"} have an account?{" "}
				<a href="/register" className="text-cyan-700 hover:text-cyan-600">
					Sign up
				</a>
			</p>
		</div>
	);
};

export default FormLogin;
