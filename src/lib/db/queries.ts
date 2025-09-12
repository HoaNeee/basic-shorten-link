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
import { sendMail } from "@/helpers/send-mail";
import { OneTimeCode } from "@/types/one-time-code.types";

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

    const subject = "Register - Your OTP Code";
    const html = `
    <h1>Register New Account</h1>
    <p>We received a request to register your account. Use the following OTP code to register your account:</p>
    <p>OTP will expire in 3 minutes</p>
    <h2 style="color: #000;">${otp}</h2>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you!</p>
    `;

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

      await saveOTP({ code: otp, ref_email: email });

      return newUser || exist1 || exist2;
    }

    //send mail here

    // sendMail(email, subject, html);

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

    const query = `INSERT INTO links (user_id, url_title, url_icon, code, domain, main_url, view, status) VALUES (?,?,?,?,?,?,?,?)`;

    const [result] = (await pool.query(query, [
      user_id,
      title,
      faviconUrl,
      code,
      domain,
      main_url,
      0,
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
      `SELECT * FROM links 
        WHERE user_id = ? AND status = ? AND deleted = ?
        ORDER BY created_at DESC
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
      `SELECT * FROM links WHERE user_id = ?`,
      [user_id]
    )) as any[];

    return {
      total_view: result.reduce(
        (val: number, item: TLink) => val + item.view,
        0
      ),
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
      const [result] = (await pool.query(`SELECT * FROM links WHERE code = ?`, [
        code,
      ])) as any[];

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

const saveOTP = async (payload: Partial<OneTimeCode>) => {
  try {
    const { code, ref_email, expired_at } = payload;

    if (!code || !ref_email) {
      throw new ApiError(400);
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
        //send mail here
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

const deleteOTPWithId = async (id: number) => {
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

const getOTPWithEmail = async (email: string) => {
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

const getTitleAndRelIcon = async (main_url: string) => {
  const response = await fetch(main_url);
  const html = await response.text();
  const match = html.match(/<title>(.*?)<\/title>/i);

  const title = match && match.length > 1 ? match[1] : "No Title Found";

  let matchIcon = html.match(/<link[^>]*rel=["']icon["'][^>]*>/i);

  if (!matchIcon) {
    matchIcon = html.match(/<link[^>]*rel=["'].*icon.*	["'][^>]*>/i);
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
