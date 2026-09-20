"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRepository = void 0;
const prisma_1 = require("../../lib/prisma");
exports.vehicleRepository = {
    findAll: () => prisma_1.prisma.vehicle.findMany({ orderBy: { createdAt: "asc" } }),
};
