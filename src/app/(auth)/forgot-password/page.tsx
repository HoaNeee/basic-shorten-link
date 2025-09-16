import FormFotgotPassword from "@/components/form-forgot-password";
import React, { Suspense } from "react";

const ForgotPassword = () => {
  return (
    <Suspense fallback={<></>}>
      <FormFotgotPassword />
    </Suspense>
  );
};

export default ForgotPassword;
