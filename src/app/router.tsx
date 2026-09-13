import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { WorkoutsPage } from "@/pages/WorkoutsPage";
import { WorkoutDetailPage } from "@/pages/WorkoutDetailPage";
import { PlannerPage } from "@/pages/PlannerPage";
import { ProgressPage } from "@/pages/ProgressPage";
import { VideosPage } from "@/pages/VideosPage";
import { CoachPage } from "@/pages/CoachPage";
import { ProfilePage } from "@/pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/workouts",
        element: <WorkoutsPage />,
      },
      {
        path: "/workouts/:id",
        element: <WorkoutDetailPage />,
      },
      {
        path: "/planner",
        element: <PlannerPage />,
      },
      {
        path: "/progress",
        element: <ProgressPage />,
      },
      {
        path: "/videos",
        element: <VideosPage />,
      },
      {
        path: "/coach",
        element: <CoachPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);
