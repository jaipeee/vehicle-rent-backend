"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const api_response_1 = require("../utils/api-response");
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        return res.status(422).json({
            success: false,
            message: "Validation failed",
            errors: err.flatten(),
        });
    }
    if (err instanceof api_response_1.AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
}
