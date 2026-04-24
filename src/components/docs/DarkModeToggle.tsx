"use client";

import { useEffect, useState } from "react";

/**
 * Minimal dark-mode toggle. No `next-themes` dependency.
 * Toggles `dark` class on `<html>`. SSR-safe: reads initial state on mount.
 */
export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      className="inline-flex h-[var(--button-h)] items-center rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground shadow-[var(--shadow-1)] transition-colors hover:bg-muted"
    >
      {isDark ? "Switch to light mode" : "Switch to dark mode"}
    </button>
  );
}
