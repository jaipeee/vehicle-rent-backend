import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  NOTIFY_EMAIL_FROM: z.string().email(),
  NOTIFY_EMAIL_TO: z.string().email(),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  SHEET_API_URL: z.string().url().optional(),
  SHEET_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);