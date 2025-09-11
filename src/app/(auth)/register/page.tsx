import FormRegister from "@/components/form-register";
import React, { Suspense } from "react";

const Register = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<></>}>
        <FormRegister />
      </Suspense>
    </div>
  );
};

export default Register;
