"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicle_repository_1 = require("./vehicle.repository");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const router = (0, express_1.Router)();
router.get("/", (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const vehicles = await vehicle_repository_1.vehicleRepository.findAll();
    res.status(200).json((0, api_response_1.apiResponse)(vehicles));
}));
exports.default = router;
