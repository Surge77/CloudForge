"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useReveals } from "./use-landing-fx";

const FEATURES = [
  { num: "01", title: "WebContainer runtime", tag: "wasm", body: "A real Node.js environment, compiled to WebAssembly, booted per project in milliseconds. npm install, dev servers, build scripts — all sandboxed in the tab." },
  { num: "02", title: "Live preview", tag: "", body: "The preview pane is your dev server, not a screenshot. Save a file and watch hot-module replacement land before your hand leaves the keyboard." },
  { num: "03", title: "AI at the anvil", tag: "llm", body: "Inline suggestions in the editor, a chat panel that reads your file tree, and one-keystroke accept. It reviews, refactors, and explains — in context." },
  { num: "04", title: "Cloud persistence", tag: "", body: "Projects are saved as you work and rehydrate on any machine. Close the tab mid-thought; the forge stays warm." },
];

const TEMPLATES = ["React", "Next.js", "Vue", "Express", "Hono", "Angular"];

const AI_POINTS = [
  "Inline completions with one-keystroke accept",
  "Whole-file refactors with reviewable diffs",
  "Terminal-error explanations, in place",
];

export function LandingSections() {
  const root = useRef<HTMLDivElement | null>(null);
  useReveals(root);

  return (
    <div ref={root}>
      {/* features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <p className="forge-reveal mb-12 flex items-center gap-3 font-code text-xs uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-9 bg-primary/50" />what&apos;s in the fire
        </p>
        {FEATURES.map((f, i) => (
          <article
            key={f.num}
            className="forge-feat forge-reveal grid grid-cols-[6rem_1fr_22rem] items-baseline gap-8 border-t border-border/60 py-12 last:border-b max-md:grid-cols-[3rem_1fr]"
            style={{ "--d": `${i * 60}ms` } as React.CSSProperties}
          >
            <span className="forge-feat-num font-code text-sm tracking-wider text-muted-foreground">{f.num}</span>
            <h3 className="forge-feat-title font-display text-[clamp(1.8rem,3.6vw,3rem)] font-[440] leading-[1.05] tracking-[-0.02em]">
              {f.title}
              {f.tag && <sup className="ml-2 align-super font-code text-xs tracking-[0.16em] text-primary">{f.tag}</sup>}
            </h3>
            <p className="text-sm leading-7 text-muted-foreground max-md:col-start-2">{f.body}</p>
          </article>
        ))}
      </section>

      {/* template marquee */}
      <section className="forge-marquee-band overflow-hidden border-y border-border/60 bg-[linear-gradient(180deg,transparent,rgba(255,90,31,0.04)_50%,transparent)] py-16" aria-label="Framework templates">
        <div className="forge-marquee" aria-hidden="true">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-baseline gap-12 pr-12">
              {TEMPLATES.map((name) => (
                <span key={name} className="flex items-baseline gap-12">
                  <span className="whitespace-nowrap font-display text-[clamp(2.4rem,5vw,4rem)] font-[420] tracking-[-0.02em] text-muted-foreground/70 transition-colors hover:text-primary hover:italic">
                    {name}
                  </span>
                  <span className="self-center text-2xl text-primary/60">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ai section */}
      <section id="assistant" className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <p className="forge-reveal flex items-center gap-3 font-code text-xs uppercase tracking-[0.22em] text-primary">
            <span className="h-px w-9 bg-primary/50" />the assistant
          </p>
          <h2 className="forge-reveal font-display mt-4 text-[clamp(2.5rem,5vw,4rem)] font-[450] leading-[1.04] tracking-[-0.025em]" style={{ "--d": "80ms" } as React.CSSProperties}>
            It read the file before you asked.
          </h2>
          <p className="forge-reveal mt-6 max-w-md leading-7 text-muted-foreground" style={{ "--d": "140ms" } as React.CSSProperties}>
            The assistant sees your open buffer, your file tree, and your terminal output. Answers
            arrive shaped like your codebase — not like a forum post.
          </p>
          <ul className="mt-8 space-y-1">
            {AI_POINTS.map((p, i) => (
              <li key={p} className="forge-reveal flex items-baseline gap-3 py-2 text-sm text-muted-foreground" style={{ "--d": `${200 + i * 60}ms` } as React.CSSProperties}>
                <span className="font-code text-primary">→</span>{p}
              </li>
            ))}
          </ul>
        </div>

        <div className="forge-reveal flex flex-col gap-3 rounded-[18px] border border-border/70 bg-card p-5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)]" style={{ "--d": "200ms" } as React.CSSProperties}>
          <div className="max-w-[88%] self-end rounded-[10px] rounded-br bg-secondary px-4 py-3 text-sm">
            Why does my counter skip numbers when I click fast?
          </div>
          <div className="max-w-[88%] self-start rounded-[10px] rounded-bl border border-primary/15 bg-[linear-gradient(160deg,rgba(255,90,31,0.12),transparent)] px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mb-1 block font-code text-[0.62rem] uppercase tracking-[0.18em] text-primary">forge · ai</span>
            Stale closure — each render captures the old <code className="rounded bg-black/35 px-1.5 py-0.5 font-code text-[0.78rem] text-amber-300/90">heat</code>. Use the functional form: <code className="rounded bg-black/35 px-1.5 py-0.5 font-code text-[0.78rem] text-amber-300/90">setHeat(h =&gt; h + 1)</code>. Want me to apply it to App.tsx?
          </div>
          <div className="max-w-[88%] self-end rounded-[10px] rounded-br bg-secondary px-4 py-3 text-sm">
            Yes, and add a test.
          </div>
          <div className="max-w-[88%] self-start rounded-[10px] rounded-bl border border-primary/15 bg-[linear-gradient(160deg,rgba(255,90,31,0.12),transparent)] px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mb-1 block font-code text-[0.62rem] uppercase tracking-[0.18em] text-primary">forge · ai</span>
            Done. <code className="rounded bg-black/35 px-1.5 py-0.5 font-code text-[0.78rem] text-amber-300/90">App.tsx</code> updated, <code className="rounded bg-black/35 px-1.5 py-0.5 font-code text-[0.78rem] text-amber-300/90">App.test.tsx</code> added — 2 assertions, both passing in the runtime.
          </div>
        </div>
      </section>

      {/* finale */}
      <section id="templates" className="relative overflow-hidden px-4 py-32 text-center sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-[-20%] bottom-[-60%] h-[120%] bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,90,31,0.28),transparent_70%)]" />
        <h2 className="forge-reveal font-display relative text-[clamp(3.25rem,9vw,7rem)] font-[460] italic leading-none tracking-[-0.03em] [font-variation-settings:'SOFT'_100,'WONK'_1]">
          Strike while it&apos;s hot.
        </h2>
        <p className="forge-reveal relative mx-auto mt-6 max-w-md text-muted-foreground" style={{ "--d": "100ms" } as React.CSSProperties}>
          Pick a template, and be running code before this sentence finishes.
        </p>
        <div className="forge-reveal relative mt-10 flex justify-center" style={{ "--d": "180ms" } as React.CSSProperties}>
          <Button asChild variant="brand" size="lg">
            <Link href="/dashboard">Start building — free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
