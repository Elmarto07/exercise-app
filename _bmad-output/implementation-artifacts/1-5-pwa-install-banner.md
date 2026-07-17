# Story 1.5: Banner instalación PWA

Status: done

## Summary

Dismissible `PwaInstallBanner` on Home: "Añadir a inicio", dismiss via X sets `prefs.pwaInstallDismissed`. Hidden in standalone mode. Android `beforeinstallprompt` wired for one-tap install when available.

## File List

- components/home/pwa-install-banner.tsx
- lib/hooks/use-pwa-install.ts
- lib/copy/es.ts
- lib/copy/es.test.ts
- app/page.tsx

## Change Log

- 2026-07-12: Story 1.5 implemented
