import { cloudinary } from "./client";

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string,
  mimeType = "image/jpeg"
) {
  const base64 = fileBuffer.toString("base64");

  const result = await cloudinary.uploader.upload(
    `data:${mimeType};base64,${base64}`,
    {
      folder,
      resource_type: "auto",
    }
  );

  return {
    publicId: result.public_id,
    url: result.secure_url,
  };
}
