/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ButtonLoading } from "./ui/button";
import { post } from "@/lib/request";
import FormVerifyOTP from "./form-verify-otp";
import VerifySuccess from "./verify-success";
import { getValueInLocalStorage } from "@/lib/utils";

const accountSchema = z.object({
  account: z.union([
    z.email(),
    z.string().regex(/^[a-zA-Z0-9]{3,}$/, "Invalid username"),
  ]),
});

const FormFotgotPassword = () => {
  const [isVerifyOTP, setIsVerifyOTP] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [email_verifying, setEmail_verifying] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      account: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof accountSchema>) => {
    try {
      setLoading(true);
      await post("/auth/forgot-password", {
        account: values.account,
      });
      setEmail_verifying(values.account);
      setIsVerifyOTP(true);
      localStorage.setItem("email_verifying", values.account);
    } catch (error: any) {
      console.log(error);
      form.setError("account", {
        message: error.message || error,
      });
    } finally {
      setLoading(false);
    }
  };

  const email = email_verifying || getValueInLocalStorage("email_verifying");

  const handleVerify = async (code: string) => {
    const payload = {
      email,
      code,
    };

    try {
      setLoading(true);
      await post("/auth/verify?action=forgot-password", payload);
      setVerified(true);
      localStorage.removeItem("email_verifying");
      setError("");
    } catch (error: any) {
      setError(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <VerifySuccess title="Success! We sent new password to your email, please check it." />
    );
  }

  if (isVerifyOTP) {
    return (
      <FormVerifyOTP
        onSubmit={async (code) => {
          handleVerify(code);
        }}
        onCancel={() => {
          setError("");
          setIsVerifyOTP(false);
        }}
        email_verifying={email as string}
        error={error}
        loading={loading}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold text-center text-green-700">
        Forgot Password
      </h3>
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
                    <div className="flex flex-col gap-2">
                      <Label className="font-normal">Email or username: </Label>
                      <Input
                        placeholder="Enter email/username here"
                        type="text"
                        className="rounded-xs py-5"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage className="" />
                  </div>
                </FormItem>
              );
            }}
          />

          <div className="text-right">
            <ButtonLoading loading={loading}>Next</ButtonLoading>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormFotgotPassword;
