import express from "express";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middlewares/error-handler.middleware";

export const app = express();

// Define allowed origins
const allowedOrigins = [
  "https://vehicle-rent-chi.vercel.app",
  "https://indiventra.com",
  "https://www.indiventra.com",
  env.CORS_ORIGIN, // Keeps your existing environment variable if defined
].filter(Boolean); // Removes undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server requests)
      if (!origin) return callback(null, true);

      // Check if the origin matches localhost on any port
      const isLocalhost = /^http:\/\/localhost(:\d+)?$/.test(origin);

      if (allowedOrigins.includes(origin) || isLocalhost) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Set to true if you are using cookies, authorization headers, or sessions
  })
);

app.use(express.json());

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/v1", routes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);