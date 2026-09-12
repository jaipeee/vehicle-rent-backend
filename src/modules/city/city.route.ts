import { Router, type Request, type Response } from "express";
import { cityRepository } from "./city.repository";
import { apiResponse } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { AppError } from "../../utils/api-response";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const cities = await cityRepository.findAll();
    res.status(200).json(apiResponse(cities));
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req: Request, res: Response) => {
    const city = await cityRepository.findBySlug(req.params.slug);
    if (!city) throw new AppError("City not found", 404);
    res.status(200).json(apiResponse(city));
  })
);

export default router;