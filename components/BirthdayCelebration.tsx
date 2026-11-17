"use client";
import { useEffect, useState, useTransition } from "react";
import { Gift, PartyPopper, X } from "lucide-react";
import { Balloon, BALLOON_COLORS } from "./Balloon";
import { sendWish } from "@/app/actions";

type Celebrant = { id: string; name: string; shifted: boolean; age?: number };

function motionAllowed() {
  return (
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    document.documentElement.dataset.motion !== "off"
  );
}

function onceToday(key: string): boolean {
  try {
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, "1");
    return true;
  } catch {
    return false;
  }
}

function joinNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? "";
  return names.slice(0, -1).join(", ") + " ו" + names[names.length - 1];
}

async function fireworks() {
  const confetti = (await import("canvas-confetti")).default;
  const colors = BALLOON_COLORS;
  const end = Date.now() + 3200;
  const burst = () => {
    confetti({
      particleCount: 60,
      startVelocity: 32,
      spread: 360,
      ticks: 70,
      gravity: 0.9,
      scalar: 0.9,
      colors,
      origin: { x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.35 },
      disableForReducedMotion: true,
    });
    if (Date.now() < end) setTimeout(burst, 420);
  };
  burst();
}

function RisingBalloons() {
  const balloons = Array.from({ length: 16 }, (_, i) => ({
    left: (i * 61) % 100,
    delay: (i % 6) * 0.35,
    dur: 5.5 + ((i * 7) % 4),
    size: 38 + ((i * 13) % 26),
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
  }));
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {balloons.map((b, i) => (
        <div
          key={i}
          className="balloon-rise absolute"
          style={{ left: `${b.left}%`, bottom: -140, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}
        >
          <Balloon color={b.color} size={b.size} />
        </div>
      ))}
    </div>
  );
}

export function BirthdayCelebration({
  celebrants,
  me,
  todayKey,
  greetings,
}: {
  celebrants: Celebrant[];
  me: { id: string; name: string };
  todayKey: string;
  greetings: string[];
}) {
  const [show, setShow] = useState(false);
  const [personal, setPersonal] = useState(false);
  const iCelebrate = celebrants.some((c) => c.id === me.id);

  useEffect(() => {
    if (!celebrants.length) return;
    if (onceToday(`os-bday-anim-${me.id}-${todayKey}`) && motionAllowed()) {
      setShow(true);
      fireworks();
      const t = setTimeout(() => setShow(false), 9000);
      return () => clearTimeout(t);
    }
  }, [celebrants.length, me.id, todayKey]);

  useEffect(() => {
    if (iCelebrate && onceToday(`os-bday-msg-${me.id}-${todayKey}`)) setPersonal(true);
  }, [iCelebrate, me.id, todayKey]);

  if (!celebrants.length) return null;
  const firstName = me.name.split(" ")[0];
  const greeting = greetings[Number(todayKey.replaceAll("-", "")) % greetings.length];

  return (
    <>
      {show && <RisingBalloons />}
      {personal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4" onClick={() => setPersonal(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bday-title"
            className="card pop-in relative w-full max-w-md overflow-hidden p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setPersonal(false)} aria-label="סגירה" className="absolute top-3 left-3 rounded-full p-2 hover:bg-surface-2">
              <X size={18} />
            </button>
            <div className="mb-2 flex justify-center gap-1">
              {BALLOON_COLORS.slice(0, 3).map((c, i) => (
                <Balloon key={c} color={c} size={34} className="balloon-sway" style={{ animationDelay: `${i * 0.4}s` }} />
              ))}
            </div>
            <h2 id="bday-title" className="text-3xl font-bold text-primary">מזל טוב, {firstName}! 🎂</h2>
            <p className="mt-4 text-lg leading-relaxed">{greeting.replace("{name}", firstName)}</p>
            <button onClick={() => setPersonal(false)} className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-fg">
              תודה! 💙
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function BirthdayBanner({
  celebrants,
  meId,
}: {
  celebrants: Celebrant[];
  meId: string;
}) {
  const [wishFor, setWishFor] = useState<Celebrant | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [pending, start] = useTransition();
  if (!celebrants.length) return null;
  const names = joinNames(celebrants.map((c) => c.name));
  const shifted = celebrants.every((c) => c.shifted);
  const others = celebrants.filter((c) => c.id !== meId);

  return (
    <section
      aria-label="ימי הולדת היום"
      className="relative overflow-hidden rounded-[20px] border border-border bg-gradient-to-l from-primary-soft via-surface to-primary-soft p-6 sm:p-8 shadow-[var(--shadow)]"
    >
      <div aria-hidden className="pointer-events-none absolute -top-2 left-4 flex gap-1 sm:left-8">
        {BALLOON_COLORS.slice(0, 4).map((c, i) => (
          <Balloon key={c} color={c} size={30 + (i % 2) * 10} className="balloon-sway" style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute -bottom-6 right-1/3 hidden sm:flex gap-1 opacity-70">
        {BALLOON_COLORS.slice(3).map((c, i) => (
          <Balloon key={c} color={c} size={26} className="balloon-sway" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}
      </div>
      <div className="relative max-w-[70%] sm:max-w-none">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <PartyPopper size={18} aria-hidden /> {shifted ? "יום הולדת שמח לקראת שבת!" : "חוגגים היום!"}
        </p>
        <h2 className="mt-1 text-2xl sm:text-3xl font-bold">
          היום חוגגים יום הולדת ל{names}! 🎉
        </h2>
        {others.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {others.map((c) =>
              sent.includes(c.id) ? (
                <span key={c.id} className="rounded-xl bg-surface px-4 py-2 text-sm text-success font-semibold">
                  ✓ הברכה ל{c.name.split(" ")[0]} נשלחה
                </span>
              ) : (
                <button
                  key={c.id}
                  onClick={() => setWishFor(c)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-fg hover:opacity-90"
                >
                  <Gift size={16} aria-hidden /> שליחת ברכה ל{c.name.split(" ")[0]}
                </button>
              ),
            )}
          </div>
        )}
      </div>

      {wishFor && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4" onClick={() => setWishFor(null)}>
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="wish-title"
            className="card pop-in w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
            action={(fd) =>
              start(async () => {
                await sendWish(fd);
                setSent((s) => [...s, wishFor.id]);
                setWishFor(null);
              })
            }
          >
            <h3 id="wish-title" className="text-lg font-semibold">ברכה ל{wishFor.name}</h3>
            <input type="hidden" name="toId" value={wishFor.id} />
            <label htmlFor="wish-msg" className="sr-only">נוסח הברכה</label>
            <textarea
              id="wish-msg"
              name="message"
              required
              rows={4}
              autoFocus
              defaultValue={`מזל טוב ${wishFor.name.split(" ")[0]}! שתהיה שנה מבורכת ומוצלחת 🎉`}
              className="mt-3 w-full rounded-xl border border-border bg-surface-2 p-3 focus:border-primary"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setWishFor(null)} className="rounded-xl px-4 py-2 hover:bg-surface-2">ביטול</button>
              <button disabled={pending} className="rounded-xl bg-primary px-5 py-2 font-semibold text-primary-fg disabled:opacity-60">
                {pending ? "שולח…" : "שליחה"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
