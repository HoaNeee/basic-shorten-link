/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { get, patch, post } from "@/lib/request";
import { TUser } from "@/types/user.types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useReducer } from "react";
import { toast } from "sonner";

interface AuthState {
  user: Partial<TUser> | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | {
      type: "PENDING";
    }
  | {
      type: "SUCCESS";
      payload?: Partial<TUser> | null;
    }
  | { type: "GET_USER_SUCCESS"; payload?: Partial<TUser> | null }
  | {
      type: "LOGOUT";
    }
  | {
      type: "FAILURE";
      payload?: {
        error: string | null;
      };
    }
  | {
      type: "CLEAR_ERROR";
    };

interface AuthContextType {
  state: AuthState;
  login: (
    email: string,
    password: string,
    isRemember: boolean
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
    fullname?: string
  ) => Promise<void>;
  clearError: () => void;
  verifyAccount: (email: string, code: string) => Promise<boolean>;
  updateAccount: (payload: Partial<TUser>) => Promise<boolean>;
  cancelVerify: () => void;
}

const initialState = {
  user: null,
  loading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "PENDING":
      return {
        ...state,
        loading: true,
      };
    case "SUCCESS":
      return {
        ...state,
        user: action.payload || null,
        loading: false,
        error: null,
      };

    case "GET_USER_SUCCESS":
      return {
        ...state,
        user: action.payload || null,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        loading: false,
      };
    case "FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload?.error || null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        loading: false,
        error: null,
      };
  }
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({
  children,
  token,
}: {
  children: React.ReactNode;
  token?: string;
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      getUser();
    } else {
      createGuestUser();
    }
  }, [token]);

  const login = async (
    account: string,
    password: string,
    isRemember?: boolean
  ) => {
    dispatch({ type: "PENDING" });
    try {
      const res = (await post("/auth/login", {
        account,
        password,
        isRemember,
      })) as TUser;

      dispatch({ type: "SUCCESS", payload: res });

      if (res.status === "inactive") {
        router.push(`/register`);
        localStorage.setItem("email_verifying", res.email);
        return false;
      }

      return true;
    } catch (error: any) {
      toast.error(error.message || error);
      dispatch({ type: "FAILURE", payload: { error: error.message } });
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    fullname?: string
  ) => {
    dispatch({ type: "PENDING" });
    try {
      const response = await post("/auth/register", {
        email,
        password,
        username,
        fullname,
      });
      dispatch({ type: "SUCCESS", payload: response });
      localStorage.setItem("email_verifying", email);
    } catch (error: any) {
      toast.error(error || error.message);
      dispatch({ type: "FAILURE", payload: { error: error.message } });
    }
  };

  const logout = async () => {
    dispatch({ type: "PENDING" });
    try {
      await get("/auth/logout");
      window.location.href = "/";
      dispatch({ type: "LOGOUT" });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: { error: error.message } });
    }
  };

  const verifyAccount = async (email: string, code: string) => {
    dispatch({ type: "PENDING" });
    try {
      const res = await post("/auth/verify", { email, code });
      dispatch({ type: "SUCCESS", payload: res });
      return true;
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: { error: error.message || error } });
      return false;
    }
  };

  const updateAccount = async (payload_parameter: Partial<TUser>) => {
    dispatch({ type: "PENDING" });
    try {
      await patch("/auth/update-user", {
        ...payload_parameter,
        id: state.user?.id,
      });
      dispatch({
        type: "SUCCESS",
        payload: {
          ...state.user,
          ...payload_parameter,
        },
      });
      toast.success("Updated account success.");
      return true;
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: { error: error.message || error } });
      toast.error("An error updating account: " + (error.message || error));
      return false;
    }
  };

  const cancelVerify = async () => {
    dispatch({
      type: "SUCCESS",
      payload: {
        ...state.user,
        status: "active",
      },
    });
  };

  const getUser = async () => {
    try {
      const response = await get("/auth/get-user");
      console.log(response);
      dispatch({ type: "GET_USER_SUCCESS", payload: response });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: { error: error.message } });
      throw error;
    }
  };

  const createGuestUser = async () => {
    try {
      const response = await post("/auth/create-guest-user", {});

      dispatch({ type: "SUCCESS", payload: response });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: { error: error.message } });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        clearError,
        verifyAccount,
        cancelVerify,
        updateAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
