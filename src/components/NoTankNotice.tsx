import { Link } from "react-router";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

// Hinweis statt Liste oder Formular, solange kein Becken existiert:
// jeder Diary-Eintrag gehört zu einem Becken
export function NoTankNotice() {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <h2 className="text-h2 font-semibold">Lege zuerst ein Becken an</h2>
      <p className="text-muted-foreground">
        Jeder Diary-Eintrag gehört zu einem Becken.
      </p>
      <Link
        to="/becken/neu"
        className={buttonVariants({ className: "w-full" })}
      >
        <Plus aria-hidden="true" />
        Becken anlegen
      </Link>
    </section>
  );
}
