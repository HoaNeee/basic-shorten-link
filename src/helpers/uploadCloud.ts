/* eslint-disable @typescript-eslint/no-explicit-any */
import cloudinary from "cloudinary";
import streamifier from "streamifier";

// config cloud
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//End config cloud

const streamUpload = async (buffer: any) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "learn-node/dashboard",
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadCloud = async (buffer: any) => {
  const result = await streamUpload(buffer);
  return result as cloudinary.UploadApiResponse;
};
