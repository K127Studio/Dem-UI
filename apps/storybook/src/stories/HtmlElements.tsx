import type { ReactNode } from "react";

/** A labelled row of a story page, so each element shows what it is. */
export function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-2 border-b border-border py-4 md:grid-cols-[14rem_minmax(0,1fr)]">
      <code className="font-mono text-xs text-foreground-muted">{name}</code>
      <div className="min-w-0 text-foreground">{children}</div>
    </div>
  );
}
