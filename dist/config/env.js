"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("4000"),
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
    RESEND_API_KEY: zod_1.z.string().min(1, "RESEND_API_KEY is required"),
    NOTIFY_EMAIL_FROM: zod_1.z.string().email(),
    NOTIFY_EMAIL_TO: zod_1.z.string().email(),
    CORS_ORIGIN: zod_1.z.string().default("http://localhost:3000"),
    SHEET_API_URL: zod_1.z.string().url().optional(),
    SHEET_API_KEY: zod_1.z.string().optional(),
});
exports.env = envSchema.parse(process.env);
