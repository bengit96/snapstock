import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

/**
 * POST endpoint to upload images before user authentication
 * Images are stored with a "prelogin-" prefix for easy identification
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate image file
    const { validateImageFile } = await import("@/lib/utils/file-validation");
    const validationResult = await validateImageFile(imageFile);

    if (!validationResult.valid) {
      return NextResponse.json(
        { error: validationResult.error || "Invalid image file" },
        { status: 400 }
      );
    }

    // Generate a unique filename for pre-login uploads
    const uniqueId = nanoid();
    const fileExtension = imageFile.name.split('.').pop() || 'png';
    const secureFilename = `prelogin-${uniqueId}-${Date.now()}.${fileExtension}`;

    // Upload image to Vercel Blob Storage
    let imageUrl: string;
    try {
      const blob = await put(secureFilename, imageFile, {
        access: "public",
      });
      imageUrl = blob.url;
      console.log("Pre-login image uploaded to blob storage:", imageUrl);
    } catch (uploadError) {
      console.error("Failed to upload image to blob storage:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image. Please try again." },
        { status: 500 }
      );
    }

    // Log chart upload details for tracking
    console.log("=== Pre-Login Chart Upload ===");
    console.log("Filename:", secureFilename);
    console.log("Chart URL:", imageUrl);
    console.log("Status: Pre-authentication upload");
    console.log("Timestamp:", new Date().toISOString());
    console.log("===============================");

    // Send Discord notification about chart upload
    const { discordService } = await import("@/lib/services/discord.service");
    await discordService.notifyChartUpload({
      imageUrl,
      filename: secureFilename,
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error in upload-image route:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
