"use client";

import { createContext, useContext, type PropsWithChildren } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<Theme>("dark");

/** Low-frequency cross-cutting value — a legitimate Context use (spec §10). */
export function ThemeProvider({ children, theme = "dark" }: PropsWithChildren<{ theme?: Theme }>) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
