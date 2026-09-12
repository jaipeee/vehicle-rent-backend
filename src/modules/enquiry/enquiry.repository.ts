import { prisma } from "../../lib/prisma";
import type { CreateEnquiryInput } from "./enquiry.validation";

export const enquiryRepository = {
  create: (data: CreateEnquiryInput) => prisma.enquiry.create({ data }),
  findAll: () => prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } }),
};