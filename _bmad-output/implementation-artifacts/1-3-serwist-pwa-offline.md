# Story 1.3: Serwist PWA offline shell

Status: done

## Summary

Serwist integrated via `@serwist/turbopack`: SW at `/serwist/sw.js`, `SerwistProvider`, offline fallback at `/~offline`, manifest with standalone + theme `#22C55E`, icons 192/512 in `public/icons/`. Build precaches 26 entries including `/`.

## File List

- next.config.ts
- app/sw.ts
- app/serwist/[path]/route.ts
- app/~offline/page.tsx
- components/providers/serwist-provider.tsx
- app/layout.tsx
- public/icons/icon-192.png
- public/icons/icon-512.png
- lib/copy/es.ts (offline strings)
- package.json / bun.lock

## Change Log

- 2026-07-12: Story 1.3 implemented
