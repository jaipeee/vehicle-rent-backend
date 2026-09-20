"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const error_handler_middleware_1 = require("./middlewares/error-handler.middleware");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN }));
exports.app.use(express_1.default.json());
exports.app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
exports.app.use("/api/v1", routes_1.default);
exports.app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
exports.app.use(error_handler_middleware_1.errorHandler);
