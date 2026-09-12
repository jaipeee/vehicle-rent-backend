import { prisma } from "../../lib/prisma";

export const vehicleRepository = {
  findAll: () => prisma.vehicle.findMany({ orderBy: { createdAt: "asc" } }),
};