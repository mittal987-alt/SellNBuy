import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getUserFromToken } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

   const formData = await req.formData();
const files = formData.getAll("file") as File[];

if (!files.length) {
  return NextResponse.json(
    { message: "No files uploaded" },
    { status: 400 }
  );
}

const uploadedUrls: string[] = [];

for (const file of files) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "olx_ads" },
        (error, response) => {
          if (error) reject(error);
          else resolve(response);
        }
      )
      .end(buffer);
  });

  uploadedUrls.push(result.secure_url);
}

return NextResponse.json({
  urls: uploadedUrls,
});
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { message: "Image upload failed" },
      { status: 500 }
    );

  }
}
