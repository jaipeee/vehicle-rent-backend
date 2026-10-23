import { Router, type Request, type Response } from "express";
import multer from "multer";
import { cloudinary, isCloudinaryConfigured } from "../../lib/cloudinary";
import { asyncHandler } from "../../utils/async-handler";
import { apiResponse, AppError } from "../../utils/api-response";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const router = Router();

router.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!isCloudinaryConfigured) {
      throw new AppError(
        "Cloudinary isn't configured yet — add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env",
        503
      );
    }
    if (!req.file) {
      throw new AppError("No file uploaded — send it as multipart/form-data under the 'file' field", 400);
    }

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "indiventra" }, (error, uploadResult) => {
        if (error || !uploadResult) return reject(error ?? new Error("Upload failed"));
        resolve(uploadResult);
      });
      stream.end(req.file!.buffer);
    });

    res.status(201).json(apiResponse({ url: result.secure_url }, "File uploaded"));
  })
);

export default router;