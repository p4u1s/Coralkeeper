import { Link, useNavigate, useParams } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { TankForm } from "@/components/TankForm";
import { useTank } from "@/hooks/useTank.ts";
import { updateTank, type TankInput } from "@/services/tank.ts";

export function TankEditPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { status, tank, error } = useTank(id);

  async function handleSubmit(input: TankInput) {
    await updateTank(id, input);
    await navigate(`/becken/${id}`);
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 px-4 py-6 text-body">
      <h1 className="text-display font-semibold">Becken bearbeiten</h1>

      {status === "loading" && (
        <p className="text-muted-foreground">Wird geladen …</p>
      )}

      {status === "error" && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}

      {status === "notFound" && (
        <p className="text-muted-foreground">Becken nicht gefunden.</p>
      )}

      {(status === "error" || status === "notFound") && (
        <Link
          to="/becken"
          className={buttonVariants({
            variant: "secondary",
            className: "w-full",
          })}
        >
          Zur Beckenliste
        </Link>
      )}

      {/* Erst nach dem Laden rendern – TankForm übernimmt initialValues nur beim ersten Rendern */}
      {status === "success" && tank && (
        <TankForm
          initialValues={tank}
          submitLabel="Speichern"
          cancelTo={`/becken/${id}`}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
}

export default TankEditPage;
