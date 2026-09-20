"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enquiry_route_1 = __importDefault(require("../modules/enquiry/enquiry.route"));
const vehicle_route_1 = __importDefault(require("../modules/vehicle/vehicle.route"));
const city_route_1 = __importDefault(require("../modules/city/city.route"));
const testimonial_route_1 = __importDefault(require("../modules/testimonial/testimonial.route"));
const router = (0, express_1.Router)();
router.use("/enquiries", enquiry_route_1.default);
router.use("/vehicles", vehicle_route_1.default);
router.use("/cities", city_route_1.default);
router.use("/testimonials", testimonial_route_1.default);
exports.default = router;
