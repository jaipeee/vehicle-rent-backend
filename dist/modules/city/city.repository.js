"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityRepository = void 0;
const prisma_1 = require("../../lib/prisma");
exports.cityRepository = {
    findAll: () => prisma_1.prisma.city.findMany({ include: { spots: true } }),
    findBySlug: (slug) => prisma_1.prisma.city.findUnique({ where: { slug }, include: { spots: true } }),
};
