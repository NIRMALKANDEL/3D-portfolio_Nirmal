import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-ink)]">
        404
      </span>
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Page not found
      </h1>
      <p className="max-w-sm text-sm text-[var(--muted)]">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <LinkButton href="/">Back to Home</LinkButton>
    </Container>
  );
}
