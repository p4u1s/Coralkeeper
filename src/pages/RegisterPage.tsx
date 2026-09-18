import { useState, type SubmitEvent } from "react";
import {
  hasErrors,
  validateRegister,
  type RegisterErrors,
} from "@/lib/validation.ts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/services/auth.ts";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    //Erst prüfen - bei Feldfehlern geht keine Anfrage raus (FR-6.6)
    const errors = validateRegister(email, password, passwordRepeat);
    setFieldErrors(errors);
    if (hasErrors(errors)) {
      return;
    }
    setIsSubmitting(true);
    try {
      await signUp(email, password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registrierung fehlgeschlagen."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-svh flex-col gap-8 px-4 py-8 text-body">
      <div className="flex flex-col gap-2 pt-8">
        <h1 className="text-display font-semibold">Coralkeeper</h1>
        <p className="text-muted-foreground">
          Bestand, Becken und Logbuch für Korallenzüchter.
        </p>
      </div>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-h2 font-semibold">Neues Konto erstellen</h2>
        <p className="text-label text-muted-foreground">* Pflichtfeld</p>
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-Mail-Adresse *</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.de"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }}
            aria-invalid={fieldErrors.email !== undefined}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email && (
            <p id="email-error" className="text-label text-destructive">
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Passwort *</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Mindestens 6 Zeichen"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setFieldErrors((prev) => ({ ...prev, password: undefined }));
            }}
            aria-invalid={fieldErrors.password !== undefined}
            aria-describedby={
              fieldErrors.password ? "password-error" : undefined
            }
          />
          {fieldErrors.password && (
            <p id="password-error" className="text-label text-destructive">
              {fieldErrors.password}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password-repeat">Passwort wiederholen *</Label>
          <Input
            id="password-repeat"
            type="password"
            autoComplete="new-password"
            value={passwordRepeat}
            onChange={(event) => {
              setPasswordRepeat(event.target.value);
              setFieldErrors((prev) => ({
                ...prev,
                passwordRepeat: undefined,
              }));
            }}
            aria-invalid={fieldErrors.passwordRepeat !== undefined}
            aria-describedby={
              fieldErrors.passwordRepeat ? "password-repeat-error" : undefined
            }
          />
          {fieldErrors.passwordRepeat && (
            <p
              id="password-repeat-error"
              className="text-label text-destructive"
            >
              {fieldErrors.passwordRepeat}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Wird registriert …" : "Registrieren"}
        </Button>
        <Link
          to="/login"
          className={buttonVariants({
            variant: "secondary",
            className: "w-full",
          })}
        >
          Zur Anmeldung
        </Link>
      </form>
    </main>
  );
}
