"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryService = void 0;
const enquiry_repository_1 = require("./enquiry.repository");
const email_1 = require("../../lib/email");
const sheet_1 = require("../../lib/sheet");
exports.enquiryService = {
    async submit(input) {
        const enquiry = await enquiry_repository_1.enquiryRepository.create(input);
        // Email/sheet failures shouldn't fail the request — the lead is already saved to the DB.
        try {
            await (0, email_1.sendEnquiryNotification)(input);
        }
        catch (err) {
            console.error("Failed to send enquiry notification email:", err);
        }
        try {
            await (0, sheet_1.appendLeadToSheet)({ ...input, createdAt: enquiry.createdAt.toISOString() });
        }
        catch (err) {
            console.error("Failed to push lead to spreadsheet:", err);
        }
        return enquiry;
    },
    list: () => enquiry_repository_1.enquiryRepository.findAll(),
};
