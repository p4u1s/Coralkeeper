import { useNavigate } from "react-router";
import { TankForm } from "@/components/TankForm";
import { createTank, type TankInput } from "@/services/tank";

export function TankCreatePage() {
  const navigate = useNavigate();

  async function handleSubmit(input: TankInput) {
    await createTank(input);
    await navigate("/becken");
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 px-4 py-6 text-body">
      <h1 className="text-display font-semibold">Becken anlegen</h1>
      <TankForm
        submitLabel="Speichern"
        cancelTo="/becken"
        onSubmit={handleSubmit}
      />
    </main>
  );
}

export default TankCreatePage;
