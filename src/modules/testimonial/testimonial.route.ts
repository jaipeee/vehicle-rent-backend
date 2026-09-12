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

export default router;