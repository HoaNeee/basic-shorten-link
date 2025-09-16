"use client";

import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Button, ButtonLoading } from "./ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import ResendOTPButton from "./resend-otp-button";

interface Props {
  onSubmit: (code: string) => Promise<void>;
  error?: string;
  onCancel?: () => void;
  email_verifying?: string;
  loading?: boolean;
  title?: string;
}

const FormVerifyOTP = (props: Props) => {
  const { onSubmit, error, onCancel, email_verifying, loading, title } = props;

  const [code, setCode] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold text-center text-green-700">
        {title || "Verification"}
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
                await onSubmit(code);
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

          {error ? (
            <span className="text-destructive block mt-4">{error}</span>
          ) : null}
        </div>
        <ResendOTPButton email={email_verifying as string} />
        <div className="flex items-center justify-end gap-2 px-4 mt-6">
          <Button variant={"outline"} onClick={onCancel}>
            Previous
          </Button>
          <ButtonLoading
            loading={loading}
            disabled={code.length !== 4}
            onClick={() => {
              onSubmit(code);
            }}
          >
            Finish
          </ButtonLoading>
        </div>
      </div>
    </div>
  );
};

export default FormVerifyOTP;
