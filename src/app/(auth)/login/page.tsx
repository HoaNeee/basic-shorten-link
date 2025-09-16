"use client";

import FormLogin from "@/components/form-login";
import React, { Suspense } from "react";

const Login = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<></>}>
        <FormLogin />
      </Suspense>
    </div>
  );
};

export default Login;
