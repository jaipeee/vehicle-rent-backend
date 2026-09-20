"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const city_repository_1 = require("./city.repository");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const api_response_2 = require("../../utils/api-response");
const router = (0, express_1.Router)();
router.get("/", (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const cities = await city_repository_1.cityRepository.findAll();
    res.status(200).json((0, api_response_1.apiResponse)(cities));
}));
router.get("/:slug", (0, async_handler_1.asyncHandler)(async (req, res) => {
    const city = await city_repository_1.cityRepository.findBySlug(req.params.slug);
    if (!city)
        throw new api_response_2.AppError("City not found", 404);
    res.status(200).json((0, api_response_1.apiResponse)(city));
}));
exports.default = router;
