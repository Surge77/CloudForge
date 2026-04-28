"use server";

import { currentUser } from "@/features/auth/actions";
import { db } from "@/lib/db";
import type { Prisma, Templates } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { TemplateFolder } from "../libs/path-to-json";

type PlaygroundInput = {
  title: string;
  template: Templates;
  description?: string;
};

type ProjectDetailsInput = {
  title: string;
  description: string;
};

const requireCurrentUserId = async () => {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("Authentication required");
  }
  return user.id;
};

const getOwnedPlayground = async (id: string, userId: string) => {
  return db.playground.findFirst({
    where: { id, userId },
  });
};

const toInputJson = (value: unknown) => {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
};

export const toggleStarMarked = async (
  playgroundId: string,
  isChecked: boolean
) => {
  const userId = await requireCurrentUserId();

  try {
    const playground = await getOwnedPlayground(playgroundId, userId);
    if (!playground) {
      return { success: false, error: "Playground not found" };
    }

    if (isChecked) {
      await db.starMark.upsert({
        where: {
          userId_playgroundId: {
            userId,
            playgroundId,
          },
        },
        update: {
          isMarked: true,
        },
        create: {
          userId,
          playgroundId,
          isMarked: true,
        },
      });
    } else {
      await db.starMark.deleteMany({
        where: {
          userId,
          playgroundId,
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: true, isMarked: isChecked };
  } catch (error) {
    console.error("Error updating favorite:", error);
    return { success: false, error: "Failed to update favorite" };
  }
};

export const createPlayground = async (data: PlaygroundInput) => {
  const userId = await requireCurrentUserId();
  const title = data.title.trim();

  if (!title) {
    throw new Error("Project title is required");
  }

  const playground = await db.playground.create({
    data: {
      title,
      description: data.description?.trim() || undefined,
      template: data.template,
      userId,
    },
  });

  revalidatePath("/dashboard");
  return playground;
};

export const getAllPlaygroundForUser = async () => {
  const userId = await requireCurrentUserId();

  return db.playground.findMany({
    where: {
      userId,
    },
    include: {
      user: true,
      Starmark: {
        where: {
          userId,
        },
        select: {
          isMarked: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const getPlaygroundById = async (id: string) => {
  const userId = await requireCurrentUserId();

  return db.playground.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      template: true,
      templateFiles: {
        select: {
          content: true,
        },
      },
    },
  });
};

export const SaveUpdatedCode = async (
  playgroundId: string,
  data: TemplateFolder
) => {
  const userId = await requireCurrentUserId();
  const playground = await getOwnedPlayground(playgroundId, userId);

  if (!playground) {
    return { success: false, error: "Playground not found" };
  }

  try {
    const content = toInputJson(data);
    const templateFile = await db.templateFile.upsert({
      where: {
        playgroundId,
      },
      update: {
        content,
      },
      create: {
        playgroundId,
        content,
      },
    });

    return { success: true, templateFile };
  } catch (error) {
    console.error("SaveUpdatedCode error:", error);
    return { success: false, error: "Failed to save code" };
  }
};

export const deleteProjectById = async (id: string) => {
  const userId = await requireCurrentUserId();

  const deleted = await db.playground.deleteMany({
    where: {
      id,
      userId,
    },
  });

  revalidatePath("/dashboard");
  return { success: deleted.count > 0 };
};

export const editProjectById = async (
  id: string,
  data: ProjectDetailsInput
) => {
  const userId = await requireCurrentUserId();
  const title = data.title.trim();

  if (!title) {
    throw new Error("Project title is required");
  }

  const updated = await db.playground.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      title,
      description: data.description.trim(),
    },
  });

  revalidatePath("/dashboard");
  return { success: updated.count > 0 };
};

export const duplicateProjectById = async (id: string) => {
  const userId = await requireCurrentUserId();

  const originalPlayground = await db.playground.findFirst({
    where: { id, userId },
    include: {
      templateFiles: true,
    },
  });

  if (!originalPlayground) {
    return { success: false, error: "Original playground not found" };
  }

  const duplicatedPlayground = await db.playground.create({
    data: {
      title: `${originalPlayground.title} (Copy)`,
      description: originalPlayground.description,
      template: originalPlayground.template,
      userId,
      templateFiles: {
        create: originalPlayground.templateFiles.map((file) => ({
          content: toInputJson(file.content),
        })),
      },
    },
  });

  revalidatePath("/dashboard");
  return { success: true, playground: duplicatedPlayground };
};
