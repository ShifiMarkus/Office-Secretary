"use client";
import Link from "next/link";
import { Accessibility, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Prefs = { text?: "lg" | "xl"; contrast?: boolean; links?: boolean; motionOff?: boolean };

function applyPrefs(p: Prefs) {
  const d = document.documentElement.dataset;
  if (p.text) d.text = p.text; else delete d.text;
  if (p.contrast) d.contrast = "high"; else delete d.contrast;
  if (p.links) d.links = "underline"; else delete d.links;
  if (p.motionOff) d.motion = "off"; else delete d.motion;
}

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({});
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setPrefs(JSON.parse(localStorage.getItem("os-a11y") || "{}"));
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function update(p: Prefs) {
    setPrefs(p);
    applyPrefs(p);
    try {
      localStorage.setItem("os-a11y", JSON.stringify(p));
    } catch {}
  }

  const Toggle = ({ k, label }: { k: "contrast" | "links" | "motionOff"; label: string }) => (
    <button
      type="button"
      role="switch"
      aria-checked={!!prefs[k]}
      onClick={() => update({ ...prefs, [k]: !prefs[k] })}
      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm ${
        prefs[k] ? "border-primary bg-primary-soft text-primary font-semibold" : "border-border"
      }`}
    >
      {label}
      <span aria-hidden>{prefs[k] ? "פעיל" : "כבוי"}</span>
    </button>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full p-2.5 text-muted hover:bg-surface-2 hover:text-fg"
        aria-label="תפריט נגישות"
        aria-haspopup="dialog"
        title="נגישות"
      >
        <Accessibility size={20} aria-hidden />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setOpen(false)}>
          <div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-title"
            className="absolute top-4 left-4 w-[min(340px,calc(100vw-2rem))] card p-5 pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="a11y-title" className="text-lg font-semibold">נגישות</h2>
              <button onClick={() => setOpen(false)} aria-label="סגירת תפריט הנגישות" className="rounded-full p-2 hover:bg-surface-2">
                <X size={18} />
              </button>
            </div>
            <fieldset className="mb-3">
              <legend className="mb-2 text-sm text-muted">גודל טקסט</legend>
              <div className="grid grid-cols-3 gap-2">
                {([undefined, "lg", "xl"] as const).map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={prefs.text === t}
                    onClick={() => update({ ...prefs, text: t })}
                    className={`rounded-xl border py-2 ${prefs.text === t ? "border-primary bg-primary-soft text-primary font-semibold" : "border-border"}`}
                    style={{ fontSize: [14, 17, 20][i] }}
                  >
                    א
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="space-y-2">
              <Toggle k="contrast" label="ניגודיות גבוהה" />
              <Toggle k="links" label="הדגשת קישורים" />
              <Toggle k="motionOff" label="עצירת הנפשות" />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <button type="button" onClick={() => update({})} className="text-primary hover:underline">
                איפוס
              </button>
              <Link href="/accessibility" onClick={() => setOpen(false)} className="text-primary hover:underline">
                הצהרת נגישות
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
