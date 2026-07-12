"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { copy } from "@/lib/copy/es";
import { useExerciseLog } from "@/lib/hooks/use-exercise-log";
import { usePwaInstallPrompt } from "@/lib/hooks/use-pwa-install";
import { exerciseLogRepository } from "@/lib/storage/exercise-log-repository";

export function PwaInstallBanner() {
  const [mounted, setMounted] = useState(false);
  const log = useExerciseLog();
  const { canPromptInstall, isStandalone, promptInstall } = usePwaInstallPrompt();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || log.prefs.pwaInstallDismissed || isStandalone) {
    return null;
  }

  const { pwaInstall } = copy;

  const handleDismiss = () => {
    exerciseLogRepository.updatePrefs({ pwaInstallDismissed: true });
  };

  const handleInstall = () => {
    if (canPromptInstall) {
      void promptInstall();
    }
  };

  return (
    <aside
      aria-label={pwaInstall.title}
      className="mb-4 flex items-center gap-3 rounded-xl border border-primary bg-[#DCFCE7] px-4 py-3 text-sm text-[#16A34A]"
    >
      {canPromptInstall ? (
        <button
          type="button"
          onClick={handleInstall}
          className="min-h-11 flex-1 text-left font-medium"
        >
          {pwaInstall.title}
        </button>
      ) : (
        <p className="min-h-11 flex-1 py-2.5 font-medium">{pwaInstall.title}</p>
      )}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={pwaInstall.dismiss}
        className="flex size-11 shrink-0 items-center justify-center text-muted-foreground"
      >
        <X className="size-5" aria-hidden />
      </button>
    </aside>
  );
}
