/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { BASE_URL } from "@/lib/request";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const GoogleLoginPageCallback = () => {
  const searchParams = useSearchParams();

  const code = searchParams.get("code") || "";
  const error = searchParams.get("error") || "";

  const handleCheckParams = useCallback(() => {
    if (!code && !error) {
      localStorage.setItem("google_login_error", "You are not allowed");
      window.location.href = "/login";
      return;
    }
    if (error) {
      console.error("Error during Google login:", error);
      localStorage.setItem("google_login_error", error);
      window.location.href = "/login";
      return;
    }
    handleVerifyCode(code);
  }, [code, error]);

  useEffect(() => {
    handleCheckParams();
  }, [code, error, handleCheckParams]);

  const handleVerifyCode = async (code?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/google`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(response.statusText || "Internal Server Error");
      }

      const result = await response.json();
      if (!result.success) {
        throw result.error || result.message || new Error("Request failed");
      }

      window.location.reload();
    } catch (error: any) {
      localStorage.setItem(
        "google_login_error",
        error.message || "An error occurred"
      );
      window.location.href = "/login";
    }
  };

  return (
    <div className="dark:bg-black fixed top-0 bottom-0 left-0 right-0 w-full min-h-screen bg-white"></div>
  );
};

export default GoogleLoginPageCallback;
