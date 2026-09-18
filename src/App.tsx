import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router"
import { useAuth } from "@/hooks/useAuth.ts"
import { HomeScreen } from "@/pages/HomeScreen.tsx"
import { LoginPage } from "@/pages/LoginPage.tsx"
import { RegisterPage } from "@/pages/RegisterPage.tsx"

// Pfade nach Requirements v2.2, Abschnitt 7 (FR-6.3)
const router = createBrowserRouter(
  [
    {
      element: <GuestOnly />,
      children: [
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },
      ],
    },
    {
      element: <RequireAuth />,
      children: [{ path: "/", element: <HomeScreen /> }],
    },
    // Unbekannte Pfade => Startseite; ohne Session leitet RequireAuth weiter
    { path: "*", element: <Navigate to="/" replace /> },
  ],
  { basename: import.meta.env.BASE_URL }
)

export function App() {
  return <RouterProvider router={router} />
}

// Beim Laden nicht umleiten, sonst blitzt beim Neuladen die Anmeldung auf
function RequireAuth() {
  const { status } = useAuth()

  if (status === "loading") {
    return <LoadingScreen />
  }
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

function GuestOnly() {
  const { status } = useAuth()

  if (status === "loading") {
    return <LoadingScreen />
  }
  if (status === "authenticated") {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

function LoadingScreen() {
  return (
    <p className="px-4 py-8 text-body text-muted-foreground">Wird geladen …</p>
  )
}

export default App
