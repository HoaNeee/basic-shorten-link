"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";

const VerifySuccess = () => {
  const searchParams = useSearchParams();

  return (
    <Alert className="bg-green-50 text-green-700">
      <CheckCircle2Icon />
      <AlertTitle>Success! Your Account was be verified.</AlertTitle>
      <AlertDescription className="w-full">
        <div>
          You will be redirected to the{" "}
          <a
            href={`/login${
              searchParams.toString() ? `?${searchParams.toString()}` : ""
            }`}
            className="italic underline"
          >
            login
          </a>{" "}
          page in {10} seconds.
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default VerifySuccess;
