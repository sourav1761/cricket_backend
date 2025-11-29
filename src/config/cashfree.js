import dotenv from "dotenv";
dotenv.config();

export const appId = process.env.CASHFREE_APP_ID;
export const secretKey = process.env.CASHFREE_SECRET_KEY;
export const isProduction = true;
export const baseUrl = "https://api.cashfree.com/pg";
