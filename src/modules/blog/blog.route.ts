import { Router, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { apiResponse } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";

const router = Router();
const q = (v: unknown) => (typeof v === "string" ? v : "");

// Most specific posts first, then general ones fill the remaining slots.
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const city = q(req.query.city);
    const category = q(req.query.category);

    const posts = await prisma.blogPost.findMany({
      where: { citySlug: { in: ["", city] }, categorySlug: { in: ["", category] } },
    });
    const score = (p: { citySlug: string; categorySlug: string }) =>
      (p.citySlug ? 1 : 0) + (p.categorySlug ? 1 : 0);
    posts.sort((a, b) => score(b) - score(a) || +b.publishedAt - +a.publishedAt);

    res.status(200).json(apiResponse(posts.slice(0, 4)));
  })
);

export default router;