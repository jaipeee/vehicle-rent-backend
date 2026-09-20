import { Router } from "express";
import enquiryRoutes from "../modules/enquiry/enquiry.route";
import vehicleRoutes from "../modules/vehicle/vehicle.route";
import cityRoutes from "../modules/city/city.route";
import testimonialRoutes from "../modules/testimonial/testimonial.route";
import uploadRoutes from "../modules/upload/upload.route";

const router = Router();

router.use("/enquiries", enquiryRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/cities", cityRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/upload", uploadRoutes);

export default router;