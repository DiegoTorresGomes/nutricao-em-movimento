import { cloudinary } from "./client";

export async function uploadImage(fileBuffer: Buffer, folder: string) {
  const base64 = fileBuffer.toString("base64");

  const result = await cloudinary.uploader.upload(
    `data:image/*;base64,${base64}`,
    {
      folder,
      resource_type: "image",
    }
  );

  return {
    publicId: result.public_id,
    url: result.secure_url,
  };
}