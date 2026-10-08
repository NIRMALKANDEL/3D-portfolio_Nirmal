import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent-ink)]">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--foreground)] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-[60ch] text-[15px] leading-relaxed text-[var(--muted)] sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}
