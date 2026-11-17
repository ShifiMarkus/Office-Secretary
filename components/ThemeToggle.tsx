"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";
const NEXT: Record<Mode, Mode> = { light: "dark", dark: "system", system: "light" };
const LABEL: Record<Mode, string> = { light: "מצב בהיר", dark: "מצב כהה", system: "לפי המכשיר" };

function apply(mode: Mode) {
  const dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");
  useEffect(() => {
    try {
      setMode((localStorage.getItem("os-theme") as Mode) || "system");
    } catch {}
  }, []);
  const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;
  return (
    <button
      type="button"
      onClick={() => {
        const next = NEXT[mode];
        setMode(next);
        try {
          localStorage.setItem("os-theme", next);
        } catch {}
        apply(next);
      }}
      className="rounded-full p-2.5 text-muted hover:bg-surface-2 hover:text-fg"
      aria-label={`ערכת צבעים: ${LABEL[mode]}. לחצו להחלפה`}
      title={LABEL[mode]}
    >
      <Icon size={20} aria-hidden />
    </button>
  );
}
