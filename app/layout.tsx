import type { Metadata, Viewport } from "next";

import { AppSerwistProvider } from "@/components/providers/serwist-provider";
import { copy } from "@/lib/copy/es";
import "./globals.css";

export const metadata: Metadata = {
  title: copy.appName,
  description: "PWA personal para registrar ejercicio y estiramientos",
  manifest: "/manifest.webmanifest",
  applicationName: copy.appName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: copy.appName,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#22c55e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-dvh overflow-x-hidden antialiased">
        <AppSerwistProvider>
          <div className="mx-auto min-h-dvh w-full max-w-[428px]">{children}</div>
        </AppSerwistProvider>
      </body>
    </html>
  );
}
