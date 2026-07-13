"use client";

import { useEffect, useRef, useState } from "react";
import { useReveals, useTilt } from "./use-landing-fx";

const TREE = ["src/", "App.tsx", "Button.tsx", "styles.css", "package.json", "vite.config.ts"];

const TERM = [
  { text: "$ npm run dev", kind: "prompt" as const, delay: 500 },
  { text: "forge  dev server warming…", kind: "dim" as const, delay: 700 },
  { text: "VITE v5.2.0  ready in 302 ms", kind: "ok" as const, delay: 350 },
  { text: "➜  Local: http://localhost:5173/", kind: "plain" as const, delay: 250 },
];

export function WorkspaceShowcase() {
  const zone = useRef<HTMLElement | null>(null);
  const card = useRef<HTMLDivElement | null>(null);
  const [lines, setLines] = useState<number>(0);

  useReveals(zone);
  useTilt(zone, card);

  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLines(TERM.length);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      let acc = 0;
      TERM.forEach((line, i) => {
        acc += line.delay;
        setTimeout(() => setLines(i + 1), acc);
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={zone}
      id="runtime"
      className="relative mx-auto max-w-7xl px-4 pt-32 pb-24 [perspective:1600px] sm:px-6 lg:px-8"
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="forge-reveal flex items-center gap-3 font-code text-xs uppercase tracking-[0.22em] text-primary">
            <span className="h-px w-9 bg-primary/50" />the runtime
          </p>
          <h2 className="forge-reveal font-display mt-4 max-w-[16ch] text-[clamp(2.5rem,5vw,4rem)] font-[450] leading-[1.04] tracking-[-0.025em]" style={{ "--d": "80ms" } as React.CSSProperties}>
            Everything a machine does, a tab does now.
          </h2>
        </div>
        <p className="forge-reveal max-w-sm text-sm leading-7 text-muted-foreground" style={{ "--d": "160ms" } as React.CSSProperties}>
          File tree, editor, terminal, live preview, AI — one surface. The dev server below is
          running inside the page you&apos;re reading.
        </p>
      </div>

      <div
        ref={card}
        className="forge-tilt forge-reveal overflow-hidden rounded-[18px] border border-border/70 bg-card shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8),0_0_80px_-30px_rgba(255,90,31,0.3)]"
        style={{ "--d": "220ms" } as React.CSSProperties}
      >
        <div className="flex h-11 items-center justify-between border-b border-border/70 bg-muted/40 px-4">
          <div className="flex gap-[7px]">
            <span className="h-[11px] w-[11px] rounded-full bg-primary/70" />
            <span className="h-[11px] w-[11px] rounded-full bg-muted" />
            <span className="h-[11px] w-[11px] rounded-full bg-muted" />
          </div>
          <span className="rounded border border-border/60 px-3 py-1 font-code text-xs text-muted-foreground">
            app.cloudforge.dev/workspace
          </span>
          <span className="w-8" />
        </div>

        <div className="grid min-h-[520px] grid-cols-[170px_1fr_250px] grid-rows-[1fr_148px] max-lg:grid-cols-1 max-lg:grid-rows-none">
          <aside className="border-r border-border/70 p-4 font-code text-xs text-muted-foreground max-lg:hidden">
            <p className="mb-4 text-[0.62rem] uppercase tracking-[0.2em]">Explorer</p>
            {TREE.map((f) => (
              <p
                key={f}
                className={`rounded px-2 py-[0.32rem] ${f.startsWith(".") || f.includes("/") ? "" : "pl-5"} ${
                  f === "App.tsx" ? "bg-primary/12 text-primary" : ""
                }`}
              >
                {f}
              </p>
            ))}
          </aside>

          <div className="border-r border-border/70 bg-[#0d0a08] font-code text-[0.8rem] leading-[1.75] max-lg:border-r-0">
            <span className="inline-flex items-center gap-2 border-r border-border/70 border-b border-b-primary/60 bg-card px-4 py-[0.55rem] text-xs text-muted-foreground">
              App.tsx
            </span>
            <pre className="overflow-x-auto px-5 py-4 text-muted-foreground">
{`import { useState } from 'react';

export default function App() {
  const [heat, setHeat] = useState(0);

  return (
    <main className="forge">
      <h1>CloudForge</h1>
      <Button onClick={() => setHeat(heat + 1)}>
        Heat: {heat}`}<span className="forge-caret" />{`
      </Button>
    </main>
  );
}`}
            </pre>
          </div>

          <aside className="flex flex-col max-lg:hidden">
            <div className="border-b border-border/70 p-4">
              <p className="mb-2 font-code text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">Live preview</p>
              <div className="rounded-[10px] border border-border/70 bg-muted/40 p-4">
                <p className="font-display text-base italic">CloudForge</p>
                <p className="mt-1 text-xs text-muted-foreground">edits render on save</p>
                <span className="mt-3 inline-block rounded bg-primary px-3 py-1.5 font-code text-xs font-semibold text-primary-foreground">
                  Heat: 1
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="mb-2 font-code text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">AI assistant</p>
              <div className="rounded-[10px] border border-primary/15 bg-[linear-gradient(160deg,rgba(255,90,31,0.12),transparent_60%)] p-3 text-xs leading-relaxed text-muted-foreground">
                <p className="mb-1 font-code text-[0.62rem] uppercase tracking-[0.1em] text-primary">forge · ai</p>
                Counter state looks good — want me to add a keyboard handler and an aria-label?
              </div>
            </div>
          </aside>

          <div className="col-span-full border-t border-border/70 bg-[#080604] px-5 py-4 font-code text-xs leading-[1.9]">
            {TERM.slice(0, lines).map((l) => (
              <p
                key={l.text}
                className={l.kind === "ok" ? "text-emerald-400" : l.kind === "dim" ? "text-muted-foreground/60" : "text-muted-foreground"}
              >
                {l.kind === "prompt" ? <><span className="text-primary">$</span> {l.text.slice(2)}</> : l.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
