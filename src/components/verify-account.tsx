import React, { useState } from "react";
import { getValueInLocalStorage } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import FormVerifyOTP from "./form-verify-otp";

const VerifyAccount = ({
  setVerified,
}: {
  setVerified: (val: boolean) => void;
}) => {
  const { verifyAccount, cancelVerify, state } = useAuth();

  const [loading, setLoading] = useState(false);

  const email = getValueInLocalStorage("email_verifying");

  const onSubmit = async (code: string) => {
    setLoading(true);
    const success = await verifyAccount(email as string, code);
    if (success) {
      localStorage.removeItem("email_verifying");
      setVerified(true);
    }
    setLoading(false);
  };

  return (
    <FormVerifyOTP
      onSubmit={(code) => onSubmit(code)}
      loading={loading}
      email_verifying={email as string}
      error={state.error as string}
      onCancel={() => {
        localStorage.removeItem("email_verifying");
        cancelVerify();
      }}
    />
  );
};

export default VerifyAccount;
