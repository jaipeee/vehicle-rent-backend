import { Router, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { apiResponse } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
    res.status(200).json(apiResponse(testimonials));
  })
);
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const city = typeof req.query.city === "string" ? req.query.city : "";
    const category = typeof req.query.category === "string" ? req.query.category : "";
    const all = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

    // First non-empty tier wins: city+category -> city -> category -> everything.
    const tiers = [
      all.filter((t) => (!city || t.cityName === city) && (!category || t.categorySlug === category)),
      city ? all.filter((t) => t.cityName === city) : [],
      category ? all.filter((t) => t.categorySlug === category) : [],
      all,
    ];
    res.status(200).json(apiResponse(tiers.find((t) => t.length) ?? []));
  })
);

export default router;