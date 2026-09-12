import type { Request, Response } from "express";
import { enquiryService } from "./enquiry.service";
import { apiResponse } from "../../utils/api-response";

export const enquiryController = {
  submit: async (req: Request, res: Response) => {
    const enquiry = await enquiryService.submit(req.body);
    res.status(201).json(apiResponse(enquiry, "Enquiry submitted successfully"));
  },

  list: async (_req: Request, res: Response) => {
    const enquiries = await enquiryService.list();
    res.status(200).json(apiResponse(enquiries));
  },
};