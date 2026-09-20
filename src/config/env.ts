import "dotenv/config";
import { z } from "zod";

// .env files often leave optional vars as "" rather than omitting them entirely —
// treat empty string the same as unset so z.string().url().optional() doesn't
// reject a blank SHEET_API_URL as an "invalid URL".
const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

const envSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  NOTIFY_EMAIL_FROM: z.string().email(),
  NOTIFY_EMAIL_TO: z.string().email(),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  SHEET_API_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  SHEET_API_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);