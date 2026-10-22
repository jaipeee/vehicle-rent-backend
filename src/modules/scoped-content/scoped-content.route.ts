import { Router, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { apiResponse } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";

const q = (v: unknown) => (typeof v === "string" ? v : "");

// First non-empty group wins: city+category -> city -> category -> global.
function pickGroup<T extends { citySlug: string; categorySlug: string }>(rows: T[], city: string, category: string) {
  const groups = [
    rows.filter((r) => r.citySlug === city && r.categorySlug === category),
    rows.filter((r) => r.citySlug === city && r.categorySlug === ""),
    rows.filter((r) => r.citySlug === "" && r.categorySlug === category),
    rows.filter((r) => r.citySlug === "" && r.categorySlug === ""),
  ];
  return groups.find((g) => g.length > 0) ?? [];
}

const order = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }];

export const heroRouter = Router();
heroRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const rows = await prisma.heroSlide.findMany({ where: { active: true }, orderBy: order });
    res.status(200).json(apiResponse(pickGroup(rows, q(req.query.city), q(req.query.category))));
  })
);

export const fleetRouter = Router();
fleetRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const city = q(req.query.city);
    const category = q(req.query.category);
    const rows = await prisma.fleetItem.findMany({ where: { active: true }, orderBy: order });
    let picked = pickGroup(rows, city, category);

    // A group that isn't specific to a vehicle shows only the cards linked to
    // that vehicle on vehicle pages (falls back to all if none match).
    if (category && picked.length && picked[0].categorySlug === "") {
      const only = picked.filter((r) => r.linkCategorySlug === category);
      if (only.length) picked = only;
    }
    res.status(200).json(apiResponse(picked));
  })
);

export const servicesRouter = Router();
servicesRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const rows = await prisma.serviceCard.findMany({ where: { active: true }, orderBy: order });
    res.status(200).json(apiResponse(pickGroup(rows, q(req.query.city), q(req.query.category))));
  })
);