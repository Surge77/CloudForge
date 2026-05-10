"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
        className="forge-panel group flex cursor-pointer flex-row items-center justify-between rounded-lg p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/70"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex items-center justify-center bg-background/70 group-hover:border-primary/70 group-hover:bg-primary/10 group-hover:text-primary"
            size={"icon"}
          >
            <GitPullRequestArrow size={30} className="transition-transform duration-300 group-hover:translate-y-1" />
          </Button>
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2 font-code text-xs text-primary">
              <Terminal className="h-3.5 w-3.5" />
              import source
            </div>
            <h1 className="text-xl font-semibold">Open GitHub Repository</h1>
            <p className="max-w-[260px] text-sm text-muted-foreground">Work with repositories in the Forge editor.</p>
          </div>
        </div>

        <div className="hidden h-20 w-20 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary sm:flex">
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
