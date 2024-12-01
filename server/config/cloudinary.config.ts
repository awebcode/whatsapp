// cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "./env.config";

// Ensure you set your environment variables or hard-code them (not recommended for production)
cloudinary.config({
  cloud_name: envConfig.cloudinaryCloudName,
  api_key: envConfig.cloudinaryApiKey,
  api_secret: envConfig.cloudinaryApiSecret,
  secure: true,
});

// Export the cloudinary instance for use in your application
export default cloudinary;
