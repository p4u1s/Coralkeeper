// Feldprüfung der Auth-Formulare vor dem Absenden (FR-6.6)

// Gleicher Wert wie in den Supabase-Auth-Einstellungen (TASK-03-06, Schritt 8)
export const MIN_PASSWORD_LENGTH = 6

// Bewusst grob: Text@Text.Text ohne Leerzeichen – die genaue Prüfung macht Supabase
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type LoginErrors = {
  email?: string
  password?: string
}

export type RegisterErrors = LoginErrors & {
  passwordRepeat?: string
}

export function validateLogin(email: string, password: string): LoginErrors {
  return {
    email: checkEmail(email),
    password: password === "" ? "Bitte Passwort eingeben." : undefined,
  }
}

export function validateRegister(
  email: string,
  password: string,
  passwordRepeat: string
): RegisterErrors {
  return {
    email: checkEmail(email),
    password: checkNewPassword(password),
    passwordRepeat: checkPasswordRepeat(password, passwordRepeat),
  }
}

// true, sobald mindestens ein Feld einen Fehlertext hat
export function hasErrors(errors: LoginErrors | RegisterErrors): boolean {
  return Object.values(errors).some((message) => message !== undefined)
}

function checkEmail(email: string): string | undefined {
  if (email === "") {
    return "Bitte E-Mail-Adresse eingeben."
  }
  if (!EMAIL_PATTERN.test(email)) {
    return "Bitte eine gültige E-Mail-Adresse eingeben, z. B. name@example.de."
  }
  return undefined
}

function checkNewPassword(password: string): string | undefined {
  if (password === "") {
    return "Bitte Passwort eingeben."
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.`
  }
  return undefined
}

function checkPasswordRepeat(
  password: string,
  passwordRepeat: string
): string | undefined {
  if (passwordRepeat === "") {
    return "Bitte Passwort wiederholen."
  }
  if (passwordRepeat !== password) {
    return "Die Passwörter stimmen nicht überein."
  }
  return undefined
}
