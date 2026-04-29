import Link from "next/link";
import { Github as LucideGithub } from "lucide-react";

export function Footer() {
  const socialLinks = [
    {
      href: "#",
      icon: (
        <LucideGithub className="w-5 h-5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" />
      ),
    },
  ];

  return (
    <footer className="relative z-20 border-t border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-8 text-center sm:px-6">
        <div className="flex gap-4">
          {socialLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </Link>
          ))}
        </div>

        <p className="font-code text-xs text-muted-foreground">
          CloudForge runtime online / {new Date().getFullYear()} / all systems nominal
        </p>
      </div>
    </footer>
  );
}
