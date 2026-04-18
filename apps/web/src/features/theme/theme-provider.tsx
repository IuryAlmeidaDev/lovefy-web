"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const DEFAULT_STORAGE_KEY = "lovefy-theme";

export type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function readStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  try {
    const savedTheme = localStorage.getItem(storageKey);

    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : defaultTheme;
  } catch {
    return defaultTheme;
  }
}

function writeStoredTheme(storageKey: string, theme: Theme) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(storageKey, theme);
  } catch {}
}

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme(storageKey, defaultTheme));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    writeStoredTheme(storageKey, theme);
  }, [storageKey, theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
