import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/design-system.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sellast | Sistema POS Empresarial",
  description: "Sistema de punto de venta profesional para México. Gestión de inventario, ventas, clientes y reportes.",
  keywords: ["POS", "punto de venta", "inventario", "ventas", "México", "ERP"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sellast POS"
  },
  openGraph: {
    title: "Sellast | Sistema POS Empresarial",
    description: "Sistema de punto de venta profesional para México",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366F1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <meta name="google" content="notranslate" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body style={{ fontFamily: 'var(--font-primary)' }}>
        <Providers>{children}</Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('[PWA] Service Worker registered'))
                    .catch(err => console.log('[PWA] SW registration failed:', err));
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}


