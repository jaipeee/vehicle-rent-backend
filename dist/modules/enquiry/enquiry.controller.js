"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryController = void 0;
const enquiry_service_1 = require("./enquiry.service");
const api_response_1 = require("../../utils/api-response");
exports.enquiryController = {
    submit: async (req, res) => {
        const enquiry = await enquiry_service_1.enquiryService.submit(req.body);
        res.status(201).json((0, api_response_1.apiResponse)(enquiry, "Enquiry submitted successfully"));
    },
    list: async (_req, res) => {
        const enquiries = await enquiry_service_1.enquiryService.list();
        res.status(200).json((0, api_response_1.apiResponse)(enquiries));
    },
};
