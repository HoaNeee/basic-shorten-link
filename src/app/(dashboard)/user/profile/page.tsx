"use client";

import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button, ButtonLoading } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { TUser } from "@/types/user.types";
import { postImage } from "@/lib/request";
import Link from "next/link";
import ProfileSkeleton from "./loading";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .max(20, {
      message: "Username must be less than 20 characters",
    }),
  fullname: z
    .string()
    .min(2, {
      message: "Full name must be at least 2 characters",
    })
    .max(50, {
      message: "Full name must be less than 50 characters",
    }),
  email: z.email({
    message: "Please enter a valid email address",
  }),
});

const Profile = () => {
  const { state: auth, updateAccount } = useAuth();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<File | string | undefined>();

  const isGoogleProvider = auth.user?.provider === "google";

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
    },
  });

  useEffect(() => {
    if (auth.user) {
      form.setValue("email", auth.user?.email || "");
      form.setValue("username", auth.user?.username || "");
      form.setValue("fullname", auth.user?.fullname || "");
      setAvatar(auth.user.avatar);
      setInitialLoading(false);
    }
  }, [auth.user, form]);

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    setLoading(true);
    try {
      const payload: Partial<TUser> = {
        ...values,
      };

      if (avatar) {
        if (typeof avatar !== "string") {
          const res = await postImage("file", avatar);
          payload.avatar = res.data;
        } else {
          payload.avatar = avatar;
        }
      } else {
        payload.avatar = "";
      }

      if (isGoogleProvider) {
        delete payload.username;
        delete payload.email;
      }

      const success = await updateAccount(payload);

      if (!success) {
        throw new Error();
      }
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleCancel = () => {
    form.reset({
      username: auth.user?.username,
      fullname: auth.user?.fullname,
      email: auth.user?.email,
    });
    setIsEditing(false);
  };

  if (!auth.user || initialLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-2xl p-6 mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-purple-800">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="size-20">
            <AvatarImage
              src={
                avatar
                  ? typeof avatar === "string"
                    ? avatar
                    : URL.createObjectURL(avatar)
                  : undefined
              }
              alt={auth.user?.username}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-r from-blue-300 to-purple-300 text-lg font-bold text-white uppercase">
              {auth?.user.fullname
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <label
              htmlFor="avatar-upload"
              className="bg-primary hover:bg-primary/90 absolute bottom-0 right-0 p-2 text-white transition-colors rounded-full cursor-pointer"
            >
              <Camera size={16} />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{auth.user?.fullname}</h2>
          <p className="text-gray-600">@{auth.user?.username}</p>
          <span
            className={`inline-block px-2 py-1 text-xs rounded-full ${
              auth.user.status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-200"
            }`}
          >
            {auth.user?.status}
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <div className="dark:bg-neutral-800 p-6 space-y-6 bg-white border rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing || isGoogleProvider}
                      placeholder="Enter your username"
                      className={
                        !isEditing || isGoogleProvider ? "bg-gray-50" : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  {isGoogleProvider && (
                    <p className="text-sm text-gray-500">
                      Username cannot be changed for Google accounts
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled={!isEditing || isGoogleProvider}
                      placeholder="Enter your email"
                      className={
                        !isEditing || isGoogleProvider ? "bg-gray-50" : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  {isGoogleProvider && (
                    <p className="text-sm text-gray-500">
                      Email cannot be changed for Google accounts
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Additional Information (Read-only) */}
            <div className="pt-4 space-y-4 border-t">
              <h4 className="dark:text-white/80 gray-200 font-medium text-gray-900">
                Account Information
              </h4>

              <div className="md:grid-cols-2 grid grid-cols-1 gap-4">
                <div>
                  <label className="dark:text-gray-300 block mb-1 text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <Input value={auth.user.id} disabled className="bg-gray-50" />
                </div>

                <div>
                  <label className="dark:text-gray-300 block mb-1 text-sm font-medium text-gray-700">
                    Account Type
                  </label>
                  <Input
                    value={auth.user?.is_guest ? "Guest" : "Member"}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="dark:text-gray-300 block mb-1 text-sm font-medium text-gray-700">
                    Login Provider
                  </label>
                  <Input
                    value={
                      auth.user?.provider === "google"
                        ? "Google"
                        : "Email Account"
                    }
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="dark:text-gray-300 block mb-1 text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Input
                    value={auth.user?.status}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="dark:text-gray-300 block mb-1 text-sm font-medium text-gray-700">
                  Last Updated
                </label>
                <Input
                  value={new Date(
                    auth?.user?.updated_at as Date
                  ).toLocaleDateString("vi", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex pt-4 space-x-3">
                <ButtonLoading
                  type="submit"
                  loading={loading}
                  className="flex-1"
                >
                  Save Changes
                </ButtonLoading>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>

      {/* Change Password Section - Only for non-Google accounts */}
      {!isGoogleProvider && (
        <div className="dark:bg-neutral-800 p-6 space-y-6 bg-white border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Change Password</h3>
              <p className="dark:text-gray-300 text-sm text-gray-600">
                Update your account password
              </p>
            </div>
            <Link href={"/user/profile/change-password"}>
              <Button variant="outline">Change Password</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
