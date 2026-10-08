import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BaseProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md";
  className?: string;
  /** Adds a trailing arrow nested in its own circle that nudges on hover. */
  arrow?: boolean;
};

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[color,background-color,border-color,opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary: "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90",
  secondary:
    "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
  ghost: "text-[var(--foreground)] hover:text-[var(--accent)]",
  // For use on accent-filled surfaces.
  inverse: "bg-[var(--accent-foreground)] text-[var(--accent)] hover:opacity-90",
};

function TrailingArrow({ variant }: { variant: NonNullable<BaseProps["variant"]> }) {
  return (
    <span
      aria-hidden
      className={cn(
        "-mr-3 flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px group-hover/btn:scale-105",
        variant === "primary" ? "bg-black/15" : variant === "inverse" ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]" : "bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]"
      )}
    >
      <ArrowUpRight size={14} />
    </span>
  );
}

const sizes: Record<NonNullable<BaseProps["size"]>, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
};

type LinkButtonProps = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
};

type ButtonElProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  target,
  rel,
  arrow = false,
}: LinkButtonProps) {
  const isExternal = href.startsWith("http");
  // Static assets (e.g. /resume.pdf) aren't app routes — next/link would try
  // to RSC-prefetch them and log a 404. Use a plain anchor for those instead.
  const isStaticAsset = !isExternal && /\.[a-z0-9]+$/i.test(href);

  if (isStaticAsset) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={cn(base, variants[variant], sizes[size], className)}
      >
        {children}
        {arrow && <TrailingArrow variant={variant} />}
      </a>
    );
  }

  return (
    <Link
      href={href}
      target={target ?? (isExternal ? "_blank" : undefined)}
      rel={rel ?? (isExternal ? "noopener noreferrer" : undefined)}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
      {arrow && <TrailingArrow variant={variant} />}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  arrow = false,
  ...props
}: ButtonElProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
      {arrow && <TrailingArrow variant={variant} />}
    </button>
  );
}
