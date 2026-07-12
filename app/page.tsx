import { TodayDate } from "@/components/home/today-date";
import { PwaInstallBanner } from "@/components/home/pwa-install-banner";
import { copy } from "@/lib/copy/es";

export default function HomePage() {
  return (
    <main className="app-shell flex min-h-dvh flex-col gap-6 px-4 py-8">
      <PwaInstallBanner />

      <header>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">
          {copy.home.headline}
        </h1>
        <TodayDate />
      </header>

      <p className="text-sm text-muted-foreground">
        Próximamente: marcar entreno y estiramientos.
      </p>
    </main>
  );
}
