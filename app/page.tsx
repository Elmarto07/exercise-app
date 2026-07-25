import { DailyStretchCard } from "@/components/home/daily-stretch-card";
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

      <DailyStretchCard />

      <a
        href="/history"
        className="mt-auto pb-6 text-center text-base text-muted-foreground underline"
      >
        {home.historyLink}
      </a>
    </main>
  );
}
