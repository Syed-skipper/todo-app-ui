"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeModeContext = createContext({ mode: "light", toggleMode: () => {} });

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme_mode");
    if (saved === "dark" || saved === "light") setMode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme_mode", mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((m) => (m === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export const useThemeMode = () => useContext(ThemeModeContext);
