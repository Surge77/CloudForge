import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Cloud,
  Code2,
  FileCode2,
  MonitorPlay,
  Play,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const codeLines = [
  "import { useState } from 'react';",
  "import { Button } from './Button';",
  "",
  "export default function App() {",
  "  const [count, setCount] = useState(0);",
  "",
  "  return (",
  "    <main className=\"forge-app\">",
  "      <h1>CloudForge</h1>",
  "      <Button onClick={() => setCount(count + 1)}>",
  "        Count: {count}",
  "      </Button>",
  "    </main>",
  "  );",
  "}",
];

const features = [
  {
    icon: Terminal,
    label: "WebContainer",
    detail: "Run npm scripts in-browser",
  },
  {
    icon: MonitorPlay,
    label: "Live Preview",
    detail: "See changes as you save",
  },
  {
    icon: Bot,
    label: "AI Assistant",
    detail: "Review, fix, and refactor",
  },
  {
    icon: Cloud,
    label: "Cloud Sync",
    detail: "Projects stay available",
  },
];

const templates = [
  {
    name: "React",
    detail: "Component workspace",
    icon: "/react.svg",
  },
  {
    name: "Next.js",
    detail: "Full-stack starter",
    icon: "/nextjs-icon.svg",
    invert: true,
  },
  {
    name: "Vue",
    detail: "Reactive frontend",
    icon: "/vuejs-icon.svg",
  },
  {
    name: "Express",
    detail: "API runtime",
    icon: "/expressjs-icon.svg",
    invert: true,
  },
  {
    name: "Hono",
    detail: "Edge-ready API",
    icon: "/hono.svg",
  },
  {
    name: "Angular",
    detail: "Structured app shell",
    icon: "/angular-2.svg",
  },
];

export default function Home() {
  return (
    <div className="relative z-20 min-h-screen overflow-hidden px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl items-center gap-10 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:py-16">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 font-code text-xs text-primary">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(255,90,31,0.8)]" />
            Runtime online
          </div>

          <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            AI Code Editor.
            <span className="block text-primary">Run Anywhere.</span>
            <span className="block">Ship Faster.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            CloudForge is a browser-based code workspace for building, running,
            and refining projects with live preview, WebContainer execution, AI
            assistance, and cloud persistence.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg">
              <Link href="/dashboard">
                Get Started Free
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-background/60">
              <Link href="#runtime">
                <Play className="h-4 w-4" />
                View Demo
              </Link>
            </Button>
          </div>

          <div id="features" className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {features.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="min-h-[104px] rounded-lg border border-border/70 bg-background/55 p-4 backdrop-blur transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <Icon className="mb-4 h-4 w-4 text-primary" />
                <p className="text-sm font-medium leading-none text-foreground">{label}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="runtime" className="forge-panel-strong overflow-hidden rounded-lg">
          <div className="flex h-10 items-center justify-between border-b border-border/70 bg-muted/30 px-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            <div className="font-code text-xs text-muted-foreground">
              app.cloudforge.dev/workspace
            </div>
          </div>

          <div className="grid min-h-[560px] grid-cols-[168px_1fr_235px] grid-rows-[1fr_150px] max-lg:grid-cols-[132px_1fr] max-lg:grid-rows-[1fr_170px] max-sm:grid-cols-1">
            <aside className="border-r border-border/70 bg-background/45 p-3 max-sm:hidden">
              <div className="mb-3 flex items-center justify-between font-code text-[11px] uppercase text-muted-foreground">
                Explorer
                <FileCode2 className="h-3.5 w-3.5" />
              </div>
              {["src", "components", "App.tsx", "Button.tsx", "styles.css", "package.json"].map((item, index) => (
                <div
                  key={item}
                  className={`mb-1 flex items-center gap-2 rounded px-2 py-1.5 text-xs ${
                    item === "App.tsx" ? "bg-primary/15 text-primary" : "text-muted-foreground"
                  }`}
                  style={{ paddingLeft: index < 2 ? 8 : 18 }}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  {item}
                </div>
              ))}
            </aside>

            <main className="border-r border-border/70 bg-[#0d0d0f] text-zinc-200 max-lg:border-r-0">
              <div className="flex h-9 items-center border-b border-white/10 bg-zinc-950/80 px-3 font-code text-xs text-zinc-400">
                App.tsx
              </div>
              <div className="overflow-hidden p-4 font-code text-[12px] leading-6 sm:text-[13px]">
                {codeLines.map((line, index) => (
                  <div key={`${line}-${index}`} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="select-none text-right text-zinc-600">{index + 1}</span>
                    <span>
                      {line || "\u00a0"}
                    </span>
                  </div>
                ))}
              </div>
            </main>

            <aside className="bg-background/45 max-lg:hidden">
              <div className="border-b border-border/70 p-3">
                <div className="mb-2 font-code text-[11px] uppercase text-muted-foreground">
                  Live preview
                </div>
                <div className="rounded-lg border border-border/70 bg-card p-4">
                  <p className="font-semibold">CloudForge</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Edit App.tsx and save to preview
                  </p>
                  <Button variant="brand" size="sm" className="mt-4">
                    Count: 1
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <div className="mb-2 font-code text-[11px] uppercase text-muted-foreground">
                  AI assistant
                </div>
                <div className="rounded-lg border border-border/70 bg-card p-3">
                  <p className="text-xs text-muted-foreground">
                    How can I improve this component?
                  </p>
                  <div className="mt-3 rounded border border-primary/20 bg-primary/10 p-2 text-xs text-primary">
                    Add accessible button labels and loading state.
                  </div>
                </div>
              </div>
            </aside>

            <div className="col-span-3 border-t border-border/70 bg-[#09090b] p-3 max-lg:col-span-2 max-sm:col-span-1">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-code text-[11px] uppercase text-muted-foreground">Terminal</div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  localhost:5173
                </div>
              </div>
              <div className="font-code text-xs leading-6 text-zinc-300">
                <p><span className="text-primary">$</span> npm run dev</p>
                <p className="text-emerald-400">VITE v5.2.0 ready in 302 ms</p>
                <p>Local: http://localhost:5173/</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="templates" className="mx-auto grid max-w-7xl items-stretch gap-5 pt-8 md:grid-cols-[0.85fr_1.15fr]">
        <div className="forge-panel flex h-full flex-col justify-between rounded-lg p-7">
          <div>
          <ShieldCheck className="mb-5 h-5 w-5 text-primary" />
          <h2 className="max-w-md text-2xl font-semibold tracking-tight">
            Built for serious browser development.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            Start from a framework template, run it in-browser, inspect the
            terminal, preview changes, and ask the AI assistant without leaving
            the workspace.
          </p>
          </div>
          <div className="mt-8 flex items-center gap-2 font-code text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            templates ready for runtime
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.name}
              className="group min-h-[136px] rounded-lg border border-border/70 bg-background/60 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/5"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-border/80 bg-card/80 p-2 shadow-sm">
                <Image
                  src={template.icon}
                  alt={`${template.name} logo`}
                  width={32}
                  height={32}
                  className={`object-contain ${template.invert ? "dark:invert" : ""}`}
                />
              </div>
              <p className="font-code text-sm font-medium text-foreground">{template.name}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{template.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
