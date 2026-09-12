import { prisma } from "../../lib/prisma";

export const cityRepository = {
  findAll: () => prisma.city.findMany({ include: { spots: true } }),
  findBySlug: (slug: string) =>
    prisma.city.findUnique({ where: { slug }, include: { spots: true } }),
};