"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ForgeShader } from "@/components/forge-shader";
import { igniteChars } from "./use-landing-fx";

const META = [
  { value: "0", unit: "ms", label: "environment setup" },
  { value: "6", unit: "", label: "framework templates" },
  { value: "1", unit: "", label: "tab. that's the whole stack" },
];

export function Hero() {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    let done = false;
    const ignite = () => {
      if (done) return;
      done = true;
      requestAnimationFrame(() => setLit(true));
    };
    // ignite once fonts settle so glyphs don't reflow mid-animation
    const ready = (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
    if (ready) ready.then(ignite);
    const fallback = setTimeout(ignite, 600);
    return () => clearTimeout(fallback);
  }, []);

  const line1 = igniteChars("Code,");
  const line2 = igniteChars("in your browser.", 6);

  return (
    <header
      className={`relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 ${lit ? "forge-lit" : ""}`}
    >
      <ForgeShader className="absolute inset-0 z-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(120%_90%_at_50%_110%,transparent_30%,rgba(11,8,6,0.55)_70%),linear-gradient(180deg,rgba(11,8,6,0.55),rgba(11,8,6,0.08)_40%,rgba(11,8,6,0.92))]" />

      <div className="relative z-[2] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-4 py-2 font-code text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
          <span className="h-[7px] w-[7px] rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.5)]" />
          runtime online — webcontainer v1.6
        </p>

        <h1 className="font-display max-w-[12ch] text-[clamp(3.25rem,9.5vw,8rem)] font-[470] leading-[0.98] tracking-[-0.03em]">
          <span>
            {line1.map((c) => (
              <span key={c.key} className="forge-ch" style={{ "--d": `${c.delay}ms` } as React.CSSProperties}>
                {c.ch}
              </span>
            ))}{" "}
            <span className="forge-molten forge-ch-block" style={{ "--d": "340ms" } as React.CSSProperties}>
              forged
            </span>
          </span>
          <br />
          <span>
            {line2.map((c) => (
              <span key={c.key} className="forge-ch" style={{ "--d": `${c.delay}ms` } as React.CSSProperties}>
                {c.ch}
              </span>
            ))}
          </span>
        </h1>

        <p className="font-body mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          A full development environment that lives in a tab.{" "}
          <span className="text-foreground">npm runs in-browser</span>, preview updates as you type,
          and an AI assistant works at the anvil beside you. Nothing to install. Ever.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="brand" size="lg">
            <Link href="/dashboard">
              Start building — free
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-background/50 backdrop-blur">
            <Link href="#runtime">
              <Play className="h-4 w-4" />
              Watch it run
            </Link>
          </Button>
        </div>

        <dl className="mt-16 flex flex-wrap gap-x-12 gap-y-6 font-code text-xs tracking-wide text-muted-foreground">
          {META.map((m) => (
            <div key={m.label}>
              <dt className="font-display text-3xl font-medium tracking-[-0.02em] text-foreground">
                {m.value}
                {m.unit && <span className="text-primary">{m.unit}</span>}
              </dt>
              <dd className="mt-1">{m.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
