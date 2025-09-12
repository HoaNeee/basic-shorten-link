import mysql2 from "mysql2/promise";
import { isProduction } from "../contant";

export const pool = mysql2.createPool({
  host: isProduction ? process.env.DB_HOST : "localhost",
  user: isProduction ? process.env.DB_USER : "root",
  password: isProduction ? process.env.DB_PASSWORD : "",
  database: process.env.DB_NAME,
});
