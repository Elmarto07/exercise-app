import Link from "next/link";

import { copy } from "@/lib/copy/es";

export function StretchNotFound() {
  const { stretch } = copy;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-4 py-8 text-center">
      <h1 className="text-xl font-semibold">{stretch.notFoundTitle}</h1>
      <p className="text-base text-muted-foreground">{stretch.notFoundBody}</p>
      <Link
        href="/"
        className="mt-4 flex min-h-12 w-full max-w-sm items-center justify-center rounded-xl border border-border bg-white text-base font-medium"
      >
        {stretch.backHome}
      </Link>
    </main>
  );
}
