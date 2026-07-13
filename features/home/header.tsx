import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import UserButton from "../auth/components/user-button";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "#features", label: "Features" },
  { href: "#runtime", label: "Runtime" },
  { href: "#assistant", label: "Assistant" },
];

export function Header() {
  return (
    <div className="sticky top-0 left-0 right-0 z-50 px-3 pt-3">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-border/60 bg-background/70 px-4 py-2.5 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <div className="flex items-center gap-7">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative flex items-center">
              <Image src="/logo.svg" alt="CloudForge logo" height={32} width={32} className="rounded-[9px]" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_2px_rgba(255,90,31,0.7)] animate-pulse" />
            </span>
            <span className="font-display text-lg font-medium italic tracking-tight">
              CloudForge
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative font-code text-[0.72rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <div className="hidden sm:block">
            <UserButton />
          </div>
          <Button asChild variant="brand" size="sm" className="hidden rounded-full sm:inline-flex">
            <Link href="/dashboard">Open the Forge</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
