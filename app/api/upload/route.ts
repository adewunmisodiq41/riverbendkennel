import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Only a signed-in admin may request an upload URL.
        const session = await getServerSession(authOptions);
        if (!session) {
          throw new Error("You must be signed in to upload photos.");
        }

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          addRandomSuffix: true,
          maximumSizeInBytes: 15 * 1024 * 1024 // 15MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Nothing to persist here — the browser receives blob.url directly
        // and the admin form saves it to the relevant Dog/Stud record.
        console.log("Upload completed:", blob.url);
      }
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 }
    );
  }
}
