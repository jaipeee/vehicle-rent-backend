"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryRepository = void 0;
const prisma_1 = require("../../lib/prisma");
exports.enquiryRepository = {
    create: (data) => prisma_1.prisma.enquiry.create({ data }),
    findAll: () => prisma_1.prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } }),
};
