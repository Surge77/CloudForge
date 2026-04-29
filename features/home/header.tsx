import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import UserButton from "../auth/components/user-button";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <div className="sticky top-0 left-0 right-0 z-50 px-3 pt-3">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-lg border border-border/70 bg-background/80 px-3 py-2 shadow-[0_12px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="CloudForge logo" height={34} width={34} />
            <span className="font-code text-sm font-semibold tracking-wide">
              CloudForge
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <Link href="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#runtime" className="transition-colors hover:text-foreground">
              Runtime
            </Link>
            <Link href="#templates" className="transition-colors hover:text-foreground">
              Templates
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <UserButton />
          </div>
          <Button asChild variant="brand" size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
