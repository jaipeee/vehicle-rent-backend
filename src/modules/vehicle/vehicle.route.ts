import { Router, type Request, type Response } from "express";
import { vehicleRepository } from "./vehicle.repository";
import { apiResponse } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const vehicles = await vehicleRepository.findAll();
    res.status(200).json(apiResponse(vehicles));
  })
);

export default router;