import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { QueryProvider } from "@presentation/providers/query-provider";
import { ContainerProvider } from "@presentation/providers/container-provider";
import { ThemeProvider } from "@presentation/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Midhun Raj — Films",
  description: "Filmmaker personal brand & digital asset store.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <QueryProvider>
            <ContainerProvider>{children}</ContainerProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
