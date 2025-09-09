import jwt from "jsonwebtoken";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { hash, compare } from "bcrypt-ts";
import { ApiError } from "./error";

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

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
