import type { Templates } from "@prisma/client";

export type TemplateRuntimeConfig = {
  path: string;
  installCommand: [string, ...string[]];
  startCommand: [string, ...string[]];
};

export const templateConfig: Record<Templates, TemplateRuntimeConfig> = {
  REACT: {
    path: "cloudforge-starters/react-ts",
    installCommand: ["npm", "install"],
    startCommand: ["npm", "run", "start"],
  },
  NEXTJS: {
    path: "cloudforge-starters/nextjs",
    installCommand: ["npm", "install"],
    startCommand: ["npm", "run", "dev"],
  },
  EXPRESS: {
    path: "cloudforge-starters/express-simple",
    installCommand: ["npm", "install"],
    startCommand: ["npm", "run", "start"],
  },
  VUE: {
    path: "cloudforge-starters/vue",
    installCommand: ["npm", "install"],
    startCommand: ["npm", "run", "serve"],
  },
  HONO: {
    path: "cloudforge-starters/hono-nodejs-starter",
    installCommand: ["npm", "install"],
    startCommand: ["npm", "run", "dev"],
  },
  ANGULAR: {
    path: "cloudforge-starters/angular",
    installCommand: ["npm", "install"],
    startCommand: ["npm", "run", "start"],
  },
};

export const templatePaths = Object.fromEntries(
  Object.entries(templateConfig).map(([key, value]) => [key, value.path])
) as Record<Templates, string>;
