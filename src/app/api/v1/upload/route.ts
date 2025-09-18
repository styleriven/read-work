import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: HttpStatusCode.BadRequest }
    );
  }

  const date = new Date().toISOString().split("T")[0];

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadsDir = path.join(process.cwd(), "public/uploads", date);
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  let fileName = file.name;
  let filePath = path.join(uploadsDir, fileName);

  let counter = 1;
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);
  while (fs.existsSync(filePath)) {
    fileName = `${baseName} (${counter})${ext}`;
    filePath = path.join(uploadsDir, fileName);
    counter++;
  }

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json(
    { url: `/uploads/${date}/${fileName}` },
    { status: HttpStatusCode.Ok }
  );
};
