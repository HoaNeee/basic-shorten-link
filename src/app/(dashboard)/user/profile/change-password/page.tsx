/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button, ButtonLoading } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { patch } from "@/lib/request";
import { useAuth } from "@/contexts/auth-context";

const passwordFormSchema = z
	.object({
		currentPassword: z.string().min(1, {
			message: "Current password is required",
		}),
		newPassword: z.string().min(1, {
			message: "Please enter your new password",
		}),
		confirmPassword: z.string().min(1, {
			message: "Please confirm your new password",
		}),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const ChangePassword = () => {
	const router = useRouter();
	const { state: auth } = useAuth();

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);

	const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onPasswordSubmit = async (
		values: z.infer<typeof passwordFormSchema>
	) => {
		setPasswordLoading(true);
		try {
			await patch("/auth/change-password", {
				...values,
				id: auth.user?.id,
			});
			router.replace("/user/profile");
			passwordForm.reset();
			toast.success("Password was be changed.");
		} catch (error: any) {
			console.log(error);
			toast.error("Error updating password: " + (error.message || error));
		} finally {
			setPasswordLoading(false);
		}
	};

	return (
		<div className="max-w-3xl p-6 mx-auto">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h3 className="text-xl font-semibold text-purple-800">
						Change Password
					</h3>
					<p className="text-sm text-gray-600">Update your account password</p>
				</div>
			</div>
			<div className="p-6 mt-6 space-y-6 bg-white dark:bg-neutral-800 border rounded-lg">
				<Form {...passwordForm}>
					<form
						onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
						className="space-y-4"
					>
						<FormField
							control={passwordForm.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Current Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												{...field}
												type={showCurrentPassword ? "text" : "password"}
												placeholder="Enter your current password"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="hover:bg-transparent absolute top-0 right-0 h-full px-3 py-2"
												onClick={() =>
													setShowCurrentPassword(!showCurrentPassword)
												}
											>
												{showCurrentPassword ? (
													<Eye className="w-4 h-4" />
												) : (
													<EyeOff className="w-4 h-4" />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={passwordForm.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showNewPassword ? "text" : "password"}
												placeholder="Enter your new password"
												autoComplete="new-password"
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="hover:bg-transparent absolute top-0 right-0 h-full px-3 py-2"
												onClick={() => setShowNewPassword(!showNewPassword)}
											>
												{showNewPassword ? (
													<Eye className="w-4 h-4" />
												) : (
													<EyeOff className="w-4 h-4" />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={passwordForm.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm New Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												{...field}
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Confirm your new password"
												autoComplete="new-password"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="hover:bg-transparent absolute top-0 right-0 h-full px-3 py-2"
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}
											>
												{showConfirmPassword ? (
													<Eye className="w-4 h-4" />
												) : (
													<EyeOff className="w-4 h-4" />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex pt-4 space-x-3">
							<ButtonLoading
								type="submit"
								loading={passwordLoading}
								className="flex-1"
							>
								Update Password
							</ButtonLoading>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									router.back();
									passwordForm.reset();
								}}
								disabled={passwordLoading}
								className="flex-1"
							>
								Cancel
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default ChangePassword;
