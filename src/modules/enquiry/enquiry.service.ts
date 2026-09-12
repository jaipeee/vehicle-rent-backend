import { enquiryRepository } from "./enquiry.repository";
import { sendEnquiryNotification } from "../../lib/email";
import { appendLeadToSheet } from "../../lib/sheet";
import type { CreateEnquiryInput } from "./enquiry.validation";

export const enquiryService = {
  async submit(input: CreateEnquiryInput) {
    const enquiry = await enquiryRepository.create(input);

    // Email/sheet failures shouldn't fail the request — the lead is already saved to the DB.
    try {
      await sendEnquiryNotification(input);
    } catch (err) {
      console.error("Failed to send enquiry notification email:", err);
    }

    try {
      await appendLeadToSheet({ ...input, createdAt: enquiry.createdAt.toISOString() });
    } catch (err) {
      console.error("Failed to push lead to spreadsheet:", err);
    }

    return enquiry;
  },

  list: () => enquiryRepository.findAll(),
};