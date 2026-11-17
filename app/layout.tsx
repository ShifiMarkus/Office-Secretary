import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "המזכירה — TRUSTECH", template: "%s · המזכירה — TRUSTECH" },
  description: "המזכירה הווירטואלית של TRUSTECH",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#12161b" },
  ],
};

// מחיל את ערכת הנושא והגדרות הנגישות לפני שהדף מוצג — כדי שלא יהיה הבהוב
const prefsScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('os-theme')||'system';var dark=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);d.dataset.theme=dark?'dark':'light';var a=JSON.parse(localStorage.getItem('os-a11y')||'{}');if(a.text)d.dataset.text=a.text;if(a.contrast)d.dataset.contrast='high';if(a.links)d.dataset.links='underline';if(a.motionOff)d.dataset.motion='off';}catch(e){document.documentElement.dataset.theme='light'}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
