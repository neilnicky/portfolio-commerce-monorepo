import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import { QueryProvider } from "@presentation/providers/query-provider";
import { ContainerProvider } from "@presentation/providers/container-provider";
import { ThemeProvider } from "@presentation/providers/theme-provider";
import "./globals.css";

/**
 * Brand type files. To rebrand fonts: swap these two loaders — the CSS
 * variables they expose (--font-playfair / --font-inter) are the only thing
 * globals.css binds `--font-display` / `--font-body` to, so no component
 * touches a family name directly.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Midhun J Raj | Film Director & Creative Director",
  description:
    "Cinematic brand experiences. Concepts & films for brands that want to be remembered—not just seen. Based in Kerala.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-body antialiased">
        <ThemeProvider>
          <QueryProvider>
            <ContainerProvider>{children}</ContainerProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
