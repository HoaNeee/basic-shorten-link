/* eslint-disable @typescript-eslint/no-explicit-any */
import { TUser } from "@/types/user.types";
import { ApiError } from "../error";
import {
	generateString,
	getIPAddress,
	hashPasswordUsingBcrypt,
	verifyPassword,
} from "../utils";
import { pool } from "./connect";
import { TLink } from "@/types/link.types";
import Pagination from "@/helpers/pagination";
import { sendMail, sendMailOTPRegister } from "@/helpers/send-mail";
import { OneTimeCode } from "@/types/one-time-code.types";
import { LogAction } from "@/types/log.type";
import moment from "moment";

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
		const [user] = (await pool.query(`SELECT * FROM users WHERE id = ?`, [
			id,
		])) as any[];

		if (!user || user.length <= 0) {
			throw new ApiError(404);
		}

		return user[0] as Partial<TUser>;
	} catch (error) {
		console.log(error);
		return null;
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
		if (!id) {
			throw new ApiError(400);
		}

		const columns = Object.keys(payload);
		if (payload.password) {
			const { hashPass } = await hashPasswordUsingBcrypt(payload.password);
			payload.password = hashPass;
		}

		if (payload.email || payload.username) {
			if (payload.email) {
				const exist = await getUserWithAccount(payload.email);
				if (exist && exist.id !== id && exist.status === "active") {
					throw new ApiError(400, "Email Already exist");
				}
			}
			if (payload.username) {
				const exist = await getUserWithAccount(payload.username);
				if (exist && exist.id !== id && exist.status === "active") {
					throw new ApiError(400, "Username Already exist");
				}
			}
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
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
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
			is_guest: user.is_guest,
			provider: user.provider,
		};
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
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
		const otp = generateString("number", 4);

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

			const record = await saveOTP({ code: otp, ref_email: email });
			sendMailOTPRegister(record.code, email);

			return newUser || exist1 || exist2;
		}

		const record = await saveOTP({ code: otp, ref_email: email });
		sendMailOTPRegister(record.code, email);

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

		const user = await getUserWithId(id);

		delete user?.password;

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

		const record = await getOTPWithEmail(email);

		if (!record) {
			throw new ApiError(404);
		}

		const now = Date.now();
		if (new Date(record.expired_at).getTime() < now) {
			throw new ApiError(400, "Expired Code");
		}

		if (code.trim() !== record.code.trim()) {
			throw new ApiError(400, "Invalid Code");
		}

		await deleteOTPWithId(record.id);

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

export const saveLink = async (
	user_id: string,
	main_url: string,
	domain: string
) => {
	try {
		if (!user_id || !main_url || !domain) {
			throw new ApiError(400);
		}
		const code = generateString("string", 8);

		const { title, faviconUrl } = await getTitleAndRelIcon(main_url);

		const query = `INSERT INTO links (user_id, url_title, url_icon, code, domain, main_url, status) VALUES (?,?,?,?,?,?,?)`;

		const [result] = (await pool.query(query, [
			user_id,
			title,
			faviconUrl,
			code,
			domain,
			main_url,
			"active",
		])) as any;

		const id = result.insertId;

		const [link] = (await pool.query(`SELECT * FROM links WHERE id = ?`, [
			id,
		])) as any[];

		return link[0] as TLink;
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const getLinksWithUserId = async (
	user_id?: number,
	page = 1,
	limit = 10
) => {
	try {
		if (!user_id) {
			throw new ApiError(400);
		}

		const [count] = (await pool.query(
			"SELECT COUNT(*) AS total_record FROM links WHERE user_id = ? AND status = ? AND deleted = ?",
			[user_id, "active", 0]
		)) as any[];

		const total_record = count ? count?.[0].total_record : 0;

		const initPagination = {
			page: 1,
			limitItems: limit,
		};

		const pagination = Pagination(initPagination, page, total_record);

		const [result] = await pool.query(
			`SELECT links.*, COUNT(logs_action.link_id) AS view FROM links
				LEFT JOIN logs_action ON logs_action.link_id = links.id
        WHERE user_id = ? AND status = ? AND deleted = ?
				GROUP BY (links.id)
        ORDER BY links.created_at DESC
        LIMIT ? OFFSET ?`,
			[user_id, "active", 0, pagination.limitItems, pagination.skip]
		);

		return {
			links: result as TLink[],
			total_record,
			total_page: pagination.totalPage,
		};
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const statisticsLinkWithUserId = async (user_id?: number) => {
	try {
		if (!user_id) {
			throw new ApiError(400);
		}

		const [result] = (await pool.query(
			`SELECT * FROM links WHERE user_id = ? AND status = ? AND deleted = ?`,
			[user_id, "active", 0]
		)) as any[];

		const link_ids = result.map((item: TLink) => item.id) as number[];

		const records = await Promise.all(
			link_ids.map(async (id) => {
				const [res] = (await pool.query(
					`SELECT * FROM logs_action WHERE link_id = ?`,
					[id]
				)) as any[];

				return res;
			})
		);

		return {
			total_view: records.length,
			total_link: result.length,
		};
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const getLinkWithCodeOrId = async (code?: string, id?: number) => {
	try {
		if (!code && !id) {
			throw new ApiError(400);
		}

		if (code) {
			const [result] = (await pool.query(
				`SELECT links.*, COUNT(logs_action.link_id) AS view FROM links LEFT JOIN logs_action ON logs_action.link_id = links.id WHERE code = ? GROUP BY (logs_action.link_id)`,
				[code]
			)) as any[];

			if (result && result.length > 0) {
				return result[0] as TLink;
			}
		}

		if (id) {
			const [result] = (await pool.query(`SELECT * FROM links WHERE id = ?`, [
				id,
			])) as any[];

			if (result && result.length > 0) {
				return result[0] as TLink;
			}
		}

		throw new ApiError(404, "Link Not Found");
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const updateLink = async (code?: string, payload?: Partial<TLink>) => {
	try {
		if (!code || !payload) {
			throw new ApiError(400);
		}

		const columns = Object.keys(payload);

		if (columns.length <= 0) {
			throw new ApiError(400);
		}

		const query = `
			UPDATE links
			SET ${columns
				.map((co) => {
					return `${co} = ?`;
				})
				.join(",")}
			WHERE code = ?
			`;

		await pool.query(query, [...Object.values(payload), code]);

		return {
			...payload,
		};
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const deleteLink = async (id?: number) => {
	try {
		if (!id) {
			throw new ApiError(400);
		}

		await pool.query(
			`UPDATE links SET deleted = TRUE, deletedAt = NOW() WHERE id = ?`,
			[id]
		);

		return true;
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

type TChart = {
	label: string;
	value: string;
};

export const bulkDeleteLink = async (ids?: number[]) => {
	try {
		if (!ids || ids.length <= 0) {
			throw new ApiError(400);
		}

		await Promise.all(ids.map((id) => deleteLink(id)));

		return true;
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const getDataChartLink = async (
	typeTime?: string,
	dateFrom?: string | Date,
	dateTo?: string | Date,
	code?: string
) => {
	try {
		if (!typeTime || !dateFrom || !dateTo || !code) {
			throw new ApiError(400);
		}

		const parseDateFrom = new Date(dateFrom);
		const parseDateTo = new Date(dateTo);

		if (parseDateFrom.getTime() > parseDateTo.getTime()) {
			throw new ApiError(400, "Invalid Date");
		}

		const newDateFrom = moment(parseDateFrom).format("YYYY-MM-DD");
		const newDateTo = moment(parseDateTo).add(1, "day").format("YYYY-MM-DD");

		const link = await getLinkWithCodeOrId(code);

		switch (typeTime) {
			case "day":
				const [result] = (await pool.query(
					`SELECT *, DATE_FORMAT(created_at, '%d/%m') as day, COUNT(DATE_FORMAT(created_at, '%d/%m')) AS view FROM logs_action WHERE link_id = ? AND created_at >= ? AND created_at <= ? GROUP BY (day) ORDER BY created_at DESC`,
					[link.id, newDateFrom, newDateTo]
				)) as any[];

				const diff = moment(parseDateTo).diff(parseDateFrom, "d");

				const dates = new Map();
				dates.set(
					`${moment(newDateFrom).date().toString().padStart(2, "0")}/${(
						moment(newDateFrom).month() + 1
					)
						.toString()
						.padStart(2, "0")}`,
					0
				);
				for (let i = 1; i <= diff; i++) {
					const nextDay = moment(newDateFrom).clone().add(i, "day");

					dates.set(
						`${nextDay.date().toString().padStart(2, "0")}/${(
							nextDay.month() + 1
						)
							.toString()
							.padStart(2, "0")}`,
						0
					);
				}

				for (const item of result) {
					dates.set(item.day, item.view);
				}

				const data: TChart[] = [];

				dates.forEach((val, key) => {
					data.push({
						label: key,
						value: val,
					});
				});

				return data;
			case "week":
				const [result_week] = (await pool.query(
					`SELECT *, WEEK(created_at) AS week, COUNT(WEEK(created_at)) AS view FROM logs_action WHERE link_id = ? AND created_at >= ? AND created_at <= ? GROUP BY (week) ORDER BY created_at DESC`,
					[link.id, newDateFrom, newDateTo]
				)) as any[];

				const diff_week = moment(parseDateTo).diff(parseDateFrom, "w");

				const weeks = new Map();

				for (let i = 0; i <= diff_week; i++) {
					weeks.set(
						`w-${moment(parseDateFrom).clone().add(i, "week").week()}`,
						0
					);
				}

				const data_week: TChart[] = [];

				for (const item of result_week) {
					weeks.set(`w-${item.week}`, item.view);
				}

				weeks.forEach((val, key) => {
					data_week.push({
						label: key,
						value: val,
					});
				});

				return data_week.sort((a, b) => Number(a.label) - Number(b.label));

			case "month":
				const [result_month] = (await pool.query(
					`SELECT *, DATE_FORMAT(created_at, '%m/%y') as month, COUNT(DATE_FORMAT(created_at, '%m/%y')) AS view FROM logs_action WHERE link_id = ? AND created_at >= ? AND created_at <= ? GROUP BY (month) ORDER BY created_at DESC`,
					[link.id, newDateFrom, newDateTo]
				)) as any[];

				const diff_month =
					moment(parseDateTo).month() - moment(parseDateFrom).month();

				const months = new Map();
				months.set(
					`${(moment(parseDateFrom).month() + 1)
						.toString()
						.padStart(2, "0")}/${moment(parseDateFrom)
						.year()
						.toString()
						.substring(2)}`,
					0
				);

				for (let i = 1; i <= diff_month; i++) {
					const nextMonth = moment(parseDateFrom).clone().add(i, "month");
					months.set(
						`${(nextMonth.month() + 1).toString().padStart(2, "0")}/${nextMonth
							.year()
							.toString()
							.substring(2)}`,
						0
					);
				}

				for (const item of result_month) {
					months.set(item.month, item.view);
				}

				const data_month: TChart[] = [];

				months.forEach((val, key) => {
					data_month.push({
						value: val,
						label: key,
					});
				});

				return data_month;
			case "year":
				const [result_year] = (await pool.query(
					`SELECT *, YEAR(created_at) AS year, COUNT(YEAR(created_at)) AS view FROM logs_action WHERE link_id = ? AND created_at >= ? AND created_at <= ? GROUP BY (year) ORDER BY created_at DESC`,
					[link.id, newDateFrom, newDateTo]
				)) as any[];

				const diff_year =
					moment(parseDateTo).year() - moment(parseDateFrom).year();

				const years = new Map();

				for (let i = 0; i <= diff_year; i++) {
					years.set(
						`${moment(parseDateFrom).clone().add(i, "year").year()}`,
						0
					);
				}

				for (const item of result_year) {
					years.set(`${item.year}`, item.view);
				}

				const data_year: TChart[] = [];

				years.forEach((val, key) => {
					data_year.push({
						value: val,
						label: key,
					});
				});

				return data_year;

			default:
				return;
		}
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const saveLogs = async (payload: Partial<LogAction>) => {
	try {
		const { link_id } = payload;

		if (!link_id) {
			throw new ApiError(400);
		}

		const query = `INSERT INTO logs_action (link_id) VALUES (?)`;

		const [result] = (await pool.query(query, [link_id])) as any;

		const id = result.insertId;

		const [records] = (await pool.query(
			`SELECT * FROM logs_action WHERE id = ?`,
			[id]
		)) as any[];

		return records[0] as LogAction;
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const getOTPWithEmail = async (email: string) => {
	try {
		if (!email) {
			throw new ApiError(400);
		}

		const [result] = (await pool.query(
			`SELECT * FROM one_time_codes WHERE ref_email = ? ORDER BY expired_at DESC LIMIT 1`,
			[email]
		)) as any[];

		if (result && result.length > 0) {
			return result[0] as OneTimeCode;
		}

		return null;
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const saveOTP = async (payload: Partial<OneTimeCode>) => {
	try {
		const { code, ref_email, expired_at } = payload;

		if (!code || !ref_email) {
			throw new ApiError(400, "Bad request");
		}

		const [exist] = (await pool.query(
			`SELECT * FROM one_time_codes WHERE ref_email = ? ORDER BY expired_at DESC LIMIT 1`,
			[ref_email]
		)) as any[];
		if (exist && exist.length > 0) {
			const record = exist[0] as OneTimeCode;
			const now = Date.now();
			if (new Date(record.expired_at).getTime() < now) {
				await deleteOTPWithId(record.id);
			} else {
				return record;
			}
		}

		const [result] = (await pool.query(
			`INSERT INTO one_time_codes (code, ref_email, expired_at) VALUES (?, ?,${
				expired_at ? expired_at : `NOW() + INTERVAL 3 MINUTE`
			})`,
			[code, ref_email]
		)) as any[];
		const id = result.insertId;

		const [record] = (await pool.query(
			`SELECT * FROM one_time_codes WHERE id = ?`,
			[id]
		)) as any[];

		return record[0] as OneTimeCode;
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

export const deleteOTPWithId = async (id: number) => {
	try {
		if (!id) {
			throw new ApiError(400);
		}

		await pool.query(`DELETE FROM one_time_codes WHERE id = ?`, [id]);
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Server error");
	}
};

const getTitleAndRelIcon = async (main_url: string) => {
	const response = await fetch(main_url);
	const html = await response.text();
	const match = html.match(/<title>(.*?)<\/title>/i);

	const title = match && match.length > 1 ? match[1] : "No Title Found";

	let matchIcon = html.match(/<link[^>]*rel=["']icon["'][^>]*>/i);

	if (!matchIcon) {
		matchIcon = html.match(/<link[^>]*rel=["'].*icon.*["'][^>]*>/i);
	}

	let faviconUrl = "";
	if (matchIcon) {
		const hrefMatch = matchIcon[0].match(/href=["']([^"']+)["']/i);
		if (hrefMatch) {
			const href = hrefMatch[1];
			// Nếu favicon là link tương đối thì convert thành link tuyệt đối
			faviconUrl = href.startsWith("http")
				? href
				: new URL(href, main_url).href;
		}
	}

	// fallback nếu không thấy link
	if (!faviconUrl) {
		faviconUrl = new URL("/favicon.ico", main_url).href;
	}

	return { title, faviconUrl };
};
