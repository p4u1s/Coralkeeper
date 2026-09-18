import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/services/auth.ts";
import { useAuth } from "@/hooks/useAuth.ts";

export function ProfilePage() {
  const { session } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setError(null);
    try {
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Abmelden fehlgeschlagen.");
    }
  }

  return (
    <main className="flex flex-col gap-6 px-4 py-6 text-body">
      <div className="flex flex-col gap-1">
        <h1 className="text-display font-semibold">Profil</h1>

        <p className="text-label text-muted-foreground">
          Angemeldet als {session?.user.email}
        </p>
      </div>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      <Button
        type="button"
        variant="secondary"
        className="w-full text-destructive"
        onClick={handleSignOut}
      >
        Abmelden
      </Button>
    </main>
  );
}

export default ProfilePage;
