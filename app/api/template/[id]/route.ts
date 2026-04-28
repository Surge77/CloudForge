import { auth } from "@/auth";
import { scanTemplateDirectory } from "@/features/playground/libs/path-to-json";
import { db } from "@/lib/db";
import { templateConfig } from "@/lib/template";
import path from "path";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;
  const { id } = await params;

  if (!userId) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  const playground = await db.playground.findFirst({
    where: { id, userId },
  });

  if (!playground) {
    return Response.json({ error: "Playground not found" }, { status: 404 });
  }

  const config = templateConfig[playground.template];

  if (!config) {
    return Response.json({ error: "Invalid template" }, { status: 404 });
  }

  try {
    const inputPath = path.join(process.cwd(), config.path);
    const templateJson = await scanTemplateDirectory(inputPath);

    return Response.json({ success: true, templateJson }, { status: 200 });
  } catch (error) {
    console.error("Error generating template JSON:", error);
    return Response.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}
