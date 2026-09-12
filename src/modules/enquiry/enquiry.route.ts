import { Router } from "express";
import { enquiryController } from "./enquiry.controller";
import { validateRequest } from "../../middlewares/validate-request.middleware";
import { createEnquirySchema } from "./enquiry.validation";
import { asyncHandler } from "../../utils/async-handler";

const router = Router();

router.post("/", validateRequest(createEnquirySchema), asyncHandler(enquiryController.submit));
router.get("/", asyncHandler(enquiryController.list)); // no auth yet — fine for v1 per your call

export default router;