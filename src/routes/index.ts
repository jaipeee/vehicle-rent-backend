import { Router } from "express";
import enquiryRoutes from "../modules/enquiry/enquiry.route";
import vehicleRoutes from "../modules/vehicle/vehicle.route";
import cityRoutes from "../modules/city/city.route";
import testimonialRoutes from "../modules/testimonial/testimonial.route";
import uploadRoutes from "../modules/upload/upload.route";
import pageContentRoutes from "../modules/page-content/page-content.route";
import blogRoutes from "../modules/blog/blog.route";
import adminRoutes, { requireAdmin } from "../modules/admin/admin.route";
import { heroRouter, fleetRouter } from "../modules/scoped-content/scoped-content.route";


const router = Router();

router.use("/enquiries", enquiryRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/cities", cityRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/upload", uploadRoutes);
router.use("/page-content", pageContentRoutes);
router.use("/blogs", blogRoutes);
router.use("/admin", adminRoutes);
// Recommended: only admins can upload images
router.use("/upload", requireAdmin, uploadRoutes); // replace your existing /upload line
router.use("/hero-slides", heroRouter);
router.use("/fleet", fleetRouter);

export default router;