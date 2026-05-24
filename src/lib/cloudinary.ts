import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary once from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

/**
 * Uploads a file buffer to Cloudinary with compression & optimization.
 * Returns the secure HTTPS URL of the uploaded image.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
    width?: number;
    height?: number;
    quality?: number | "auto";
  } = {}
): Promise<string> {
  const {
    folder = "ayzah-pickles/categories",
    publicId,
    width = 800,
    height = 600,
    quality = "auto",
  } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        // Auto-optimize format (webp where supported) + compress
        transformation: [
          {
            width,
            height,
            crop: "fill",
            gravity: "center",
            quality,
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export default cloudinary;
