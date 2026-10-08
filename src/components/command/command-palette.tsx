"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Copy,
  CornerDownLeft,
  FileText,
  FolderGit2,
  Moon,
  Search,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { useLanguage } from "@/context/language-context";
import { useTheme } from "@/context/theme-context";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

const OPEN_EVENT = "nk-open-palette";

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

type Command = {
  id: string;
  group: "Pages" | "Projects" | "Actions";
  label: string;
  hint?: string;
  icon: LucideIcon | typeof GithubIcon;
  run: () => void;
};

export function CommandPalette() {
  const router = useRouter();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      router.push(href);
      close();
    };
    const external = (href: string) => () => {
      window.open(href, "_blank", "noopener,noreferrer");
      close();
    };
    return [
      { id: "home", group: "Pages", label: t.nav.home, icon: ArrowRight, run: go("/") },
      { id: "about", group: "Pages", label: t.nav.about, icon: ArrowRight, run: go("/about") },
      { id: "lab", group: "Pages", label: "3D Lab", icon: ArrowRight, run: go("/#lab") },
      { id: "projects", group: "Pages", label: t.nav.projects, icon: ArrowRight, run: go("/projects") },
      { id: "experience", group: "Pages", label: t.nav.experience, icon: ArrowRight, run: go("/experience") },
      { id: "education", group: "Pages", label: t.nav.education, icon: ArrowRight, run: go("/education") },
      { id: "beyond", group: "Pages", label: t.nav.nonTech, icon: ArrowRight, run: go("/non-tech") },
      { id: "contact", group: "Pages", label: t.nav.contact, icon: ArrowRight, run: go("/contact") },
      ...projects.map<Command>((p) => ({
        id: `project-${p.slug}`,
        group: "Projects",
        label: p.title,
        hint: p.category,
        icon: FolderGit2,
        run: go(`/projects/${p.slug}`),
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: copied ? "Email copied" : "Copy email address",
        hint: site.email,
        icon: Copy,
        run: () => {
          navigator.clipboard?.writeText(site.email).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          });
        },
      },
      {
        id: "theme",
        group: "Actions",
        label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        icon: Moon,
        run: () => toggleTheme(),
      },
      { id: "resume", group: "Actions", label: t.hero.resume, icon: FileText, run: external(site.resumeUrl) },
      { id: "github", group: "Actions", label: "Open GitHub", icon: GithubIcon, run: external(site.github) },
      { id: "linkedin", group: "Actions", label: "Open LinkedIn", icon: LinkedinIcon, run: external(site.linkedin) },
    ];
  }, [router, close, t, theme, toggleTheme, copied]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.hint ?? ""} ${c.group}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, [open, close]);

  // Focus the search box on open, and hand focus back to the trigger on close.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const id = window.requestAnimationFrame(() => input.current?.focus());
    return () => {
      window.cancelAnimationFrame(id);
      previous?.focus();
    };
  }, [open]);

  useEffect(() => {
    list.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[65] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
        >
          <div
            className="absolute inset-0 bg-[var(--background)]/70 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="glass relative w-full max-w-xl overflow-hidden rounded-3xl"
            initial={reduce ? false : { opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-5">
              <Search size={16} className="shrink-0 text-[var(--muted)]" />
              <input
                ref={input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Search pages, projects and actions…"
                autoComplete="off"
                spellCheck={false}
                aria-label="Search commands"
                aria-controls="command-list"
                aria-activedescendant={filtered[active] ? `cmd-${filtered[active].id}` : undefined}
                className="h-14 w-full bg-transparent text-[15px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
              />
              <kbd className="shrink-0 rounded-md border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)]">
                Esc
              </kbd>
            </div>

            <ul
              ref={list}
              id="command-list"
              role="listbox"
              className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain p-2"
            >
              {filtered.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-[var(--muted)]">
                  No results for &ldquo;{query}&rdquo;. Try a project name or &ldquo;email&rdquo;.
                </li>
              )}
              {filtered.map((cmd, i) => {
                const showGroup = cmd.group !== lastGroup;
                lastGroup = cmd.group;
                const Icon = cmd.icon;
                return (
                  <li key={cmd.id} role="presentation">
                    {showGroup && (
                      <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                        {cmd.group}
                      </p>
                    )}
                    <button
                      type="button"
                      id={`cmd-${cmd.id}`}
                      role="option"
                      aria-selected={i === active}
                      data-index={i}
                      tabIndex={-1}
                      onMouseMove={() => setActive(i)}
                      onClick={cmd.run}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                        i === active
                          ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--foreground)]"
                          : "text-[var(--muted)]"
                      )}
                    >
                      <Icon size={16} />
                      <span className="flex-1 truncate">{cmd.label}</span>
                      {cmd.hint && (
                        <span className="hidden truncate text-xs text-[var(--muted)] sm:inline">{cmd.hint}</span>
                      )}
                      {i === active && <CornerDownLeft size={14} className="shrink-0 text-[var(--accent)]" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
