/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { hash, compare } from "bcrypt-ts";
import { ApiError } from "./error";
import { NextRequest, NextResponse } from "next/server";

export const getIPAddress = async () => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    if (!res.ok) {
      throw new Error("Server error");
    }
    const result = await res.json();
    return result.ip;
  } catch (error) {
    return "";
  }
};

export const hashPasswordUsingBcrypt = async (password: string) => {
  const salt = 10;

  const hashPass = await hash(password, salt);
  return { salt, hashPass };
};

export const verifyPassword = async (
  password: string,
  hash_password: string
) => {
  return await compare(password, hash_password);
};

export const signJWT = (payload: object, expires?: number) => {
  const secret = process.env.JWT_SECRET || "My-secret";
  const token = jwt.sign(
    payload,
    secret,
    expires ? { expiresIn: expires } : undefined
  );
  return token;
};

export const verifyJWT = (token: string) => {
  const secret = process.env.JWT_SECRET || "My-secret";
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as {
      id: number;
      ip_address: string;
      iat: number;
      exp: number;
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getValueInLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }
  return null;
};

export const generateString = (type: "number" | "string", length: number) => {
  const string = (length: number): string => {
    const patten =
      "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM0123456789";
    let out = "";
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * patten.length);
      out += patten[idx];
    }
    return out;
  };

  const number = (length: number): string => {
    const patten = "0123456789";
    let out = "";
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * patten.length);
      out += patten[idx];
    }
    return out;
  };

  if (type === "number") return number(length);

  return string(length);
};

export const getPayloadWithJWT = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("jwt_token")?.value as string;

    if (req.headers.get("authorization") && !token) {
      const newToken = req.headers
        .get("authorization")
        ?.split(" ")[1] as string;
      return verifyJWT(newToken);
    }

    if (!token) {
      throw new ApiError(401);
    }

    const payload = verifyJWT(token);
    return payload;
  } catch (error) {
    throw error;
  }
};

export const createQueryString = (name: string, value: string, query: any) => {
  const params = new URLSearchParams(query);
  params.set(name, value);
  return decodeURIComponent(params.toString());
};

export const deleteQueryString = (name: string, query: any) => {
  const params = new URLSearchParams(query);
  params.delete(name);
  return decodeURIComponent(params.toString());
};

export const setCookieOnServer = async (
  res: NextResponse,
  key: string,
  value: string,
  maxAge?: number
) => {
  try {
    res.cookies.set(key, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  } catch (error) {
    throw error;
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
