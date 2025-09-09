/* eslint-disable @typescript-eslint/no-explicit-any */
import { TUser } from "@/types/user.types";
import { ApiError } from "../error";
import {
	getIPAddress,
	hashPasswordUsingBcrypt,
	verifyPassword,
} from "../utils";
import { pool } from "./connect";

export const createGusestUser = async () => {
	try {
		const ip = await getIPAddress();

		if (!ip) {
			throw new ApiError(500, "Server error");
		}

		const [exist] = (await pool.query(
			`SELECT id,ip_address,is_guest FROM users WHERE ip_address = ?`,
			[ip]
		)) as any[];

		if (exist && exist.length > 0) {
			return exist[0] as TUser;
		}

		const query = `INSERT INTO users(ip_address, is_guest, status) VALUES (?,?,?)`;

		const [result] = (await pool.query(query, [`${ip}`, 1, "active"])) as any;
		const id = result.insertId;

		const [user] = (await pool.query(
			`SELECT id,ip_address,is_guest FROM users WHERE id = ?`,
			[id]
		)) as any[];

		return user[0] as TUser;
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const getUserWithId = async (id: number) => {
	try {
		const [user] = (await pool.query(
			`SELECT id, username, fullname, email, status FROM users WHERE id = ?`,
			[id]
		)) as any[];

		if (!user || user.length <= 0) {
			throw new ApiError(404);
		}

		return user[0] as TUser;
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const getUserWithAccount = async (account: string) => {
	try {
		if (account.includes("@")) {
			const [user] = (await pool.query(`SELECT * FROM users WHERE email = ?`, [
				account,
			])) as any[];
			if (user && user.length > 0) {
				return user[0] as TUser;
			}
		}

		const [user] = (await pool.query(`SELECT * FROM users WHERE username = ?`, [
			account,
		])) as any[];
		if (user && user.length > 0) {
			return user[0] as TUser;
		}
		return null;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const updateUserWithId = async (
	payload: Partial<TUser>,
	id?: number
) => {
	try {
		const columns = Object.keys(payload);
		if (payload.password) {
			const { hashPass } = await hashPasswordUsingBcrypt(payload.password);
			payload.password = hashPass;
		}

		const query = `
			UPDATE users
			SET ${columns
				.map((co) => {
					return `${co} = ?`;
				})
				.join(",")}
			WHERE id = ?
			`;

		await pool.query(query, [...Object.values(payload), id]);

		return {
			id: id,
			...payload,
			status: payload.status || "inactive",
		};
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const login = async (account: string, password: string) => {
	try {
		const user = await getUserWithAccount(account);

		if (!user) {
			throw new ApiError(404, "Email/username is not exists");
		}

		const is_match = await verifyPassword(password, user.password);

		if (!is_match) {
			throw new ApiError(401);
		}

		return {
			id: user.id,
			email: user.email,
			username: user.username,
			fullname: user.fullname,
			status: user.status,
		};
	} catch (error) {
		if (error instanceof ApiError) {
			console.log("chay vao day", error);
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const register = async (
	email: string,
	password: string,
	username: string,
	fullname = ""
) => {
	try {
		if (!email || !password || !username) {
			throw new ApiError(400);
		}

		const [exist1, exist2] = await Promise.all([
			getUserWithAccount(email),
			getUserWithAccount(username),
		]);

		if (exist1 || exist2) {
			if (
				(exist1 && exist1.status === "active") ||
				(exist2 && exist2.status === "active")
			) {
				throw new ApiError(404, "Email/username already exists");
			}

			const newUser = await updateUserWithId(
				{ email, password, username, fullname },
				exist1?.id || exist2?.id || undefined
			);

			return newUser || exist1 || exist2;
		}

		//send mail here

		const { hashPass } = await hashPasswordUsingBcrypt(password);

		let query = ``;

		if (fullname) {
			query = `INSERT INTO users (email, password, username, status, fullname) VALUES (?,?,?,?,?)`;
		} else {
			query = `INSERT INTO users (email, password, username, status) VALUES (?,?,?,?)`;
		}

		const [result] = (await pool.query(query, [
			email,
			hashPass,
			username,
			"inactive",
			fullname,
		])) as any;

		if (!result) {
			throw new ApiError(500);
		}

		const id = result.insertId;

		const user = getUserWithId(id);

		return user;
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const verifyAccount = async (email: string, code: string) => {
	try {
		if (!email || !code) {
			throw new ApiError(400);
		}

		if (code !== "1234") {
			throw new ApiError(400, "Code Invalid!");
		}

		const user = (await getUserWithAccount(email)) as TUser;

		const newUser = await updateUserWithId({ status: "active" }, user.id);

		return newUser;
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};
