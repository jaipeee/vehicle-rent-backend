import { Router } from "express";
import enquiryRoutes from "../modules/enquiry/enquiry.route";
import vehicleRoutes from "../modules/vehicle/vehicle.route";
import cityRoutes from "../modules/city/city.route";
import testimonialRoutes from "../modules/testimonial/testimonial.route";

const router = Router();

router.use("/enquiries", enquiryRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/cities", cityRoutes);
router.use("/testimonials", testimonialRoutes);

export default router;