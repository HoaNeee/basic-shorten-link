"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import { FaGoogle } from "react-icons/fa";
import { isProduction } from "@/lib/contant";

const GoogleLoginButton = () => {
  useEffect(() => {
    const error = localStorage.getItem("google_login_error");
    if (error) {
      toast.error("Google login failed", {
        description:
          error !== "true"
            ? `Error: ${error}`
            : "Please try again or use a different login method.",
      });
      localStorage.removeItem("google_login_error");
    }
  }, []);

  const handleLoginWithGoogle = async () => {
    const endpont = "https://accounts.google.com/o/oauth2/v2/auth";

    const g_client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const params = new URLSearchParams({
      client_id: `${g_client_id}`,
      redirect_uri: isProduction
        ? `${process.env.NEXT_PUBLIC_API_URL}/login/google`
        : `http://localhost:3000/login/google`,
      response_type: "code",
      scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      access_type: "offline",
      prompt: "consent",
    });
    const url = `${endpont}?${params.toString()}`;
    window.location.href = url;
  };

  return (
    <button
      className="bg-red-100/80 hover:text-white hover:bg-red-600 flex items-center justify-center gap-4 px-4 py-2 font-medium text-red-600 transition-colors rounded-sm cursor-pointer"
      onClick={handleLoginWithGoogle}
    >
      <FaGoogle size={18} />
      Login in with Google
    </button>
  );
};

export default GoogleLoginButton;
