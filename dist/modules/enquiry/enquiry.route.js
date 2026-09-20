"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enquiry_controller_1 = require("./enquiry.controller");
const validate_request_middleware_1 = require("../../middlewares/validate-request.middleware");
const enquiry_validation_1 = require("./enquiry.validation");
const async_handler_1 = require("../../utils/async-handler");
const router = (0, express_1.Router)();
router.post("/", (0, validate_request_middleware_1.validateRequest)(enquiry_validation_1.createEnquirySchema), (0, async_handler_1.asyncHandler)(enquiry_controller_1.enquiryController.submit));
router.get("/", (0, async_handler_1.asyncHandler)(enquiry_controller_1.enquiryController.list)); // no auth yet — fine for v1 per your call
exports.default = router;
