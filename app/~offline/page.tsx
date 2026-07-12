import Link from "next/link";

import { copy } from "@/lib/copy/es";

export default function OfflinePage() {
  return (
    <main className="app-shell flex min-h-dvh flex-col items-center justify-center gap-4 px-4 py-8 text-center">
      <h1 className="text-xl font-semibold">{copy.offline.title}</h1>
      <p className="text-sm text-muted-foreground">{copy.offline.message}</p>
      <Link
        href="/"
        className="min-h-12 rounded-xl border border-border bg-white px-6 py-3 text-base font-medium"
      >
        {copy.offline.retry}
      </Link>
    </main>
  );
}
