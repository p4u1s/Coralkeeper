import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";
import { useAuth } from "@/hooks/useAuth.ts";
import { HomeScreen } from "@/pages/HomeScreen.tsx";
import { LoginPage } from "@/pages/LoginPage.tsx";
import { RegisterPage } from "@/pages/RegisterPage.tsx";
import { DiaryPage } from "@/pages/DiaryPage.tsx";
import { ProfilePage } from "@/pages/ProfilePage.tsx";
import { TankListPage } from "@/pages/TankListPage.tsx";
import { TankDetailPage } from "@/pages/TankDetailPage.tsx";
import { TankEditPage } from "@/pages/TankEditPage.tsx";
import { AppLayout } from "@/components/AppLayout.tsx";
import { TankCreatePage } from "@/pages/TankCreatePage.tsx";
import { CoralCreatePage } from "@/pages/CoralCreatePage.tsx";
import { CoralDetailPage } from "@/pages/CoralDetailPage.tsx";

// Pfade nach Requirements v2.2, Abschnitt 7 (FR-6.3)
// Nicht in Abschnitt 7 enthalten. Festgelegt in TASK-04-01: /diary, /becken/:id/bearbeiten

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
      children: [
        {
          element: <AppLayout />,
          children: [
            { path: "/", element: <HomeScreen /> },
            { path: "/becken", element: <TankListPage /> },
            { path: "/becken/:id", element: <TankDetailPage /> },
            { path: "/koralle/:id", element: <CoralDetailPage /> },
            { path: "/diary", element: <DiaryPage /> },
            { path: "/profil", element: <ProfilePage /> },
          ],
        },
        // Formulare ohne Bottom-Navigation (design.md, Abschnitt 4)
        { path: "/becken/:id/bearbeiten", element: <TankEditPage /> },
        { path: "/becken/neu", element: <TankCreatePage /> },
        { path: "/koralle/neu", element: <CoralCreatePage /> },
      ],
    },
    // Unbekannte Pfade => Startseite; ohne Session leitet RequireAuth weiter
    { path: "*", element: <Navigate to="/" replace /> },
  ],
  { basename: import.meta.env.BASE_URL }
);

export function App() {
  return <RouterProvider router={router} />;
}

// Beim Laden nicht umleiten, sonst blitzt beim Neuladen die Anmeldung auf
function RequireAuth() {
  const { status } = useAuth();

  if (status === "loading") {
    return <LoadingScreen />;
  }
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function GuestOnly() {
  const { status } = useAuth();

  if (status === "loading") {
    return <LoadingScreen />;
  }
  if (status === "authenticated") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

function LoadingScreen() {
  return (
    <p className="px-4 py-8 text-body text-muted-foreground">Wird geladen …</p>
  );
}

export default App;
