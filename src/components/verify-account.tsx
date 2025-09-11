import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Button, ButtonLoading } from "./ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { getValueInLocalStorage } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const VerifyAccount = ({
  setVerified,
}: {
  setVerified: (val: boolean) => void;
}) => {
  const { verifyAccount, cancelVerify, state } = useAuth();

  const [code, setCode] = useState("");
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const data = getValueInLocalStorage("email_verifying");
    setLoading(true);
    const success = await verifyAccount(data as string, code);
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
        <div className="text-gray-500">
          {"Don't"} get the code?{" "}
          {resent ? (
            <span className="text-gray-400 cursor-not-allowed">
              Send again after (3:00)
            </span>
          ) : (
            <span
              className="text-cyan-600 cursor-pointer"
              onClick={() => setResent(true)}
            >
              Send again
            </span>
          )}
        </div>
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
