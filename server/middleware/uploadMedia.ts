import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import multer, { StorageEngine } from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const storage: StorageEngine = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => ({
    folder: "uploads", // Cloudinary folder name
    format: "png", // Convert all images to PNG
    public_id: `${Date.now()}_${file.originalname.split(".")[0]}`, // Unique filename
    transformation: [{ width: 300, height: 300, crop: "fill" }], // Resize to 300x300
  }),
});

export const upload = multer({ storage });

export { cloudinary };
