import type { ReactNode } from "react";
import { NavLink } from "react-router";
import {
  BeckenIcon,
  BestandIcon,
  DiaryIcon,
  ProfilIcon,
} from "@/components/NavIcons.tsx";

type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
};

// "/" braucht end, sonst wäre "Bestand" auf jeder Seite aktiv.
// "/becken" ohne end, damit "Becken" auch auf /becken/:id aktiv ist.
const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Bestand", icon: <BestandIcon />, end: true },
  { to: "/becken", label: "Becken", icon: <BeckenIcon /> },
  { to: "/diary", label: "Diary", icon: <DiaryIcon /> },
  { to: "/profil", label: "Profil", icon: <ProfilIcon /> },
];

// Hauptnavigation nach der Anmeldung (design.md, Abschnitt 4)
export function BottomNav() {
  return (
    // max-w-md wie #root, denn fixed-Elemente übernehmen dessen Breite nicht
    <nav
      aria-label="Hauptnavigation"
      className="fixed inset-x-0 bottom-0 z-10 mx-auto flex h-16 max-w-md border-t border-border bg-card"
    >
      {NAV_ITEMS.map(({ to, label, icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-caption font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          {icon}
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
