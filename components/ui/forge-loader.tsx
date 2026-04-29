import { cn } from "@/lib/utils";

type ForgeLoaderVariant =
  | "compiler"
  | "orbit"
  | "terminal"
  | "bars"
  | "grid";

interface ForgeLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: ForgeLoaderVariant;
  label?: string;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-8",
  lg: "size-12",
};

const barSizeClasses = {
  sm: "h-3 w-0.5",
  md: "h-5 w-1",
  lg: "h-7 w-1.5",
};

function ForgeLoader({
  className,
  size = "md",
  variant = "terminal",
  label = "Loading",
}: ForgeLoaderProps) {
  if (variant === "bars") {
    return (
      <span
        role="status"
        aria-label={label}
        className={cn("inline-flex items-end gap-1 text-primary", className)}
      >
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={cn(
              "animate-pulse rounded-full bg-current",
              barSizeClasses[size]
            )}
            style={{ animationDelay: `${index * 120}ms` }}
          />
        ))}
      </span>
    );
  }

  if (variant === "terminal") {
    return (
      <span
        role="status"
        aria-label={label}
        className={cn(
          "inline-grid place-items-center rounded border border-primary/35 bg-background text-primary shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08)] animate-[forge-terminal-shell_1.8s_ease-in-out_infinite]",
          sizeClasses[size],
          className
        )}
      >
        <span className="font-code text-[0.6em] font-semibold leading-none animate-[forge-terminal-cursor_1.18s_cubic-bezier(0.45,0,0.2,1)_infinite]">
          &gt;_
        </span>
      </span>
    );
  }

  if (variant === "grid") {
    return (
      <span
        role="status"
        aria-label={label}
        className={cn("grid grid-cols-2 gap-0.5 text-primary", className)}
      >
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={cn(
              "animate-pulse rounded-[2px] bg-current",
              size === "sm" ? "size-1.5" : size === "md" ? "size-3" : "size-4"
            )}
            style={{ animationDelay: `${index * 140}ms` }}
          />
        ))}
      </span>
    );
  }

  if (variant === "orbit") {
    return (
      <span
        role="status"
        aria-label={label}
        className={cn(
          "relative inline-block rounded-full border border-primary/25",
          sizeClasses[size],
          className
        )}
      >
        <span className="absolute inset-0 animate-spin rounded-full border-t-2 border-primary" />
        <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "relative inline-grid place-items-center rounded border border-primary/40 bg-primary/10 text-primary",
        sizeClasses[size],
        className
      )}
    >
      <span className="absolute inset-1 animate-spin rounded border-t border-r border-primary" />
      <span className="font-code text-[0.55em] font-bold leading-none">CF</span>
    </span>
  );
}

export { ForgeLoader };
