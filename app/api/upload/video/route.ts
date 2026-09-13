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
        const session = await getServerSession(authOptions);
        if (!session) {
          throw new Error("You must be signed in to upload videos.");
        }

        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"],
          addRandomSuffix: true,
          maximumSizeInBytes: 500 * 1024 * 1024 // 500MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Video upload completed:", blob.url);
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
