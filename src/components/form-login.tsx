"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { ButtonLoading } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useAuth } from "@/contexts/auth-context";
import { useSearchParams } from "next/navigation";
import GoogleLoginButton from "./google-login-button";

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
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const searchToString = searchParams.toString();

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
    setLoading(true);
    const success = await login(values.account, values.password, isRemember);

    if (success) {
      if (next) {
        window.location.href = next;
      } else {
        window.location.reload();
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold text-center text-green-700">Login</h3>
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
                      className="rounded-xs py-5"
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
                      className="rounded-xs py-5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex items-center justify-between w-full my-5">
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
              href={`/forgot-password${
                searchToString ? `?${searchToString}` : ""
              }`}
              className="text-cyan-700 hover:text-cyan-600 text-sm"
            >
              Forgot password?
            </a>
          </div>

          <ButtonLoading loading={loading} className="w-full py-5 rounded-sm">
            Login
          </ButtonLoading>
        </form>
      </Form>
      <div className="relative w-full my-4 h-[1px] bg-gray-200">
        <div className="-top-3 absolute left-0 flex items-center justify-center w-full">
          <span className="px-2 font-semibold text-gray-500 bg-white">Or</span>
        </div>
      </div>
      <GoogleLoginButton />
      <p className="mt-4">
        {"Don't"} have an account?{" "}
        <a
          href={`/register${searchToString ? `?${searchToString}` : ""}`}
          className="text-cyan-700 hover:text-cyan-600"
        >
          Sign up
        </a>
      </p>
    </div>
  );
};

export default FormLogin;
