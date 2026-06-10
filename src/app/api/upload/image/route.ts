import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary/upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const folder = String(formData.get("folder") || "nutricao-em-movimento/uploads");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "O arquivo precisa ser uma imagem." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadImage(buffer, folder);

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao enviar imagem." },
      { status: 500 }
    );
  }
}