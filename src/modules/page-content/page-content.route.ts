import { Router, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { apiResponse } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";

const router = Router();
const q = (v: unknown) => (typeof v === "string" ? v : "");
const SKIP = new Set(["id", "citySlug", "categorySlug", "updatedAt"]);

// Merges global -> city -> category -> city+category; the more specific row
// wins field by field, so a row only needs the fields it wants to override.
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const city = q(req.query.city);
    const category = q(req.query.category);

    const rows = await prisma.pageContent.findMany({
      where: { citySlug: { in: ["", city] }, categorySlug: { in: ["", category] } },
    });
    const score = (r: { citySlug: string; categorySlug: string }) =>
      (r.citySlug ? 1 : 0) + (r.categorySlug ? 2 : 0);
    rows.sort((a, b) => score(a) - score(b));

    const merged: Record<string, unknown> = {};
    for (const row of rows) {
      for (const [k, v] of Object.entries(row)) {
        if (SKIP.has(k)) continue;
        if (v === null || v === "" || (Array.isArray(v) && v.length === 0)) continue;
        merged[k] = v;
      }
    }
    res.status(200).json(apiResponse(merged));
  })
);

export default router;