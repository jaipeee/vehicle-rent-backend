"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnquirySchema = void 0;
const zod_1 = require("zod");
exports.createEnquirySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is required"),
    phone: zod_1.z.string().min(8, "Valid phone number required"),
    email: zod_1.z.string().email("Valid email required").optional(),
    city: zod_1.z.string().optional(),
    vehicleType: zod_1.z.string().optional(),
    eventType: zod_1.z.string().optional(),
    message: zod_1.z.string().optional(),
});
