import {
  CalendarDays,
  Cake,
  Contact,
  Inbox,
  LayoutDashboard,
  Megaphone,
  Settings,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
  managerOnly?: boolean;
  mobile?: boolean;
};

export const NAV: NavItem[] = [
  { href: "/", label: "לוח בקרה", icon: LayoutDashboard, mobile: true },
  { href: "/shopping", label: "רשימת קניות", icon: ShoppingCart, soon: true, mobile: true },
  { href: "/tickets", label: "פניות", icon: Inbox, soon: true, mobile: true },
  { href: "/meetings", label: "פגישות", icon: CalendarDays, soon: true },
  { href: "/announcements", label: "לוח הודעות", icon: Megaphone },
  { href: "/birthdays", label: "ימי הולדת", icon: Cake },
  { href: "/phonebook", label: "ספר טלפונים", icon: Contact, mobile: true },
  { href: "/settings", label: "הגדרות", icon: Settings, soon: true, managerOnly: true },
];
