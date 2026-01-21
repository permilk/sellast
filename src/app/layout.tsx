import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/design-system.css";

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
  openGraph: {
    title: "Sellast | Sistema POS Empresarial",
    description: "Sistema de punto de venta profesional para México",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrains.variable}`}>
      <body style={{ fontFamily: 'var(--font-primary)' }}>{children}</body>
    </html>
  );
}
