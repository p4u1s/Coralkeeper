import { Outlet } from "react-router";

// Rahmen für alle Seiten nach der Anmeldung außer Formularen (design.md, Abschnitt 4)
export function AppLayout() {
  return (
    <>
      {/* 104 px = 64 Navigation + 40 Luft (design.md, Abschnitt 3) */}
      <div className="pb-[104px]">
        <Outlet />
      </div>
      {/* Bottom-Navigation folgt in TASK-04-02 */}
    </>
  );
}

export default AppLayout;
