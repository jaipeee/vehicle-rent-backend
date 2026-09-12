import { z } from "zod";

export const createEnquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email("Valid email required").optional(),
  city: z.string().optional(),
  vehicleType: z.string().optional(),
  eventType: z.string().optional(),
  message: z.string().optional(),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;