"use client";

import { useState } from "react";
import { Github, GitPullRequestArrow, Terminal, Clock, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PLANNED_FEATURES = [
  "Import any public GitHub repository",
  "Preserve full directory structure",
  "Auto-detect template and install deps",
  "Sync changes back to remote (authenticated)",
];

const AddRepo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="forge-panel group relative flex cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_28px_70px_-30px_rgba(255,90,31,0.55)]"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex flex-row items-start justify-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/25 to-transparent text-primary transition-colors duration-300 group-hover:from-primary/40">
            <GitPullRequestArrow size={22} className="transition-transform duration-300 group-hover:translate-y-1" />
          </span>
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2 font-code text-[0.7rem] uppercase tracking-[0.14em] text-primary">
              <Terminal className="h-3.5 w-3.5" />
              import source
            </div>
            <h2 className="font-display text-2xl font-medium tracking-tight">Open Repository</h2>
            <p className="mt-1 max-w-[260px] text-sm text-muted-foreground">Pull a GitHub repo straight into the Forge editor.</p>
          </div>
        </div>

        <div className="relative hidden h-20 w-20 items-center justify-center rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/20 to-transparent text-primary shadow-[0_16px_40px_-18px_rgba(255,90,31,0.6)] sm:flex">
          <Github className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub Repository Import
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <Clock className="h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-amber-500">Coming Soon</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  GitHub import is actively in development.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Planned features
              </p>
              <ul className="space-y-2">
                {PLANNED_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-muted-foreground">
              For now, create a new playground from a template and paste your code manually.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddRepo;
