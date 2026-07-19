import { TodayDate } from "@/components/home/today-date";
import { HomeWorkoutSection } from "@/components/home/home-workout-section";
import { PwaInstallBanner } from "@/components/home/pwa-install-banner";
import { copy } from "@/lib/copy/es";

export default function HomePage() {
  const { home } = copy;

  return (
    <main className="app-shell flex min-h-dvh flex-col gap-6 px-4 py-8">
      <PwaInstallBanner />

      <header>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">
          {home.headline}
        </h1>
        <TodayDate />
      </header>

      <HomeWorkoutSection />

      <section className="rounded-xl border border-border bg-white p-4">
        <h2 className="text-base font-semibold">{home.dailyStretchTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {home.dailyStretchMeta}
        </p>
        <button
          type="button"
          className="mt-3 min-h-12 w-full rounded-xl border border-border bg-white text-base font-medium"
        >
          {home.stretchNow}
        </button>
      </section>

      <a
        href="/history"
        className="mt-auto pb-6 text-center text-base text-muted-foreground underline"
      >
        {home.historyLink}
      </a>
    </main>
  );
}
