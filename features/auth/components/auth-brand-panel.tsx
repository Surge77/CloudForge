"use client";

import { Zap, Bot, Terminal } from "lucide-react";
import { ForgeShader } from "@/components/forge-shader";

const POINTS = [
  { icon: Terminal, text: "npm runs in-browser — zero setup" },
  { icon: Zap, text: "Live preview updates as you type" },
  { icon: Bot, text: "AI assistant that reads your code" },
];

export function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden md:block">
      <ForgeShader className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,8,6,0.5),rgba(11,8,6,0.82))]" />
      <div className="relative flex h-full flex-col justify-between p-10">
        <span className="font-code text-xs uppercase tracking-[0.2em] text-primary">
          / cloudforge runtime
        </span>
        <div>
          <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.02em] text-foreground">
            Code, <span className="forge-molten">forged</span> in your browser.
          </h2>
          <ul className="mt-8 space-y-3">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="font-code text-[0.7rem] text-muted-foreground/70">
          a full stack, in a single tab.
        </p>
      </div>
    </div>
  );
}
