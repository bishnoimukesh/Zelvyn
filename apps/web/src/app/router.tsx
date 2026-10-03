import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { WorkoutsPage } from "@/pages/WorkoutsPage";
import { WorkoutDetailPage } from "@/pages/WorkoutDetailPage";
import { VideosPage } from "@/pages/VideosPage";
import { CoachPage } from "@/pages/CoachPage";
import { NutritionPage } from "@/pages/NutritionPage";
import { ProgressPage } from "@/pages/ProgressPage";
import { CalendarPage } from "@/pages/CalendarPage";
import { PlannerPage } from "@/pages/PlannerPage";
import { HabitsPage } from "@/pages/HabitsPage";
import { MindfulnessPage } from "@/pages/MindfulnessPage";
import { HealthPage } from "@/pages/HealthPage";
import { AchievementsPage } from "@/pages/AchievementsPage";
import { FormCheckPage } from "@/pages/FormCheckPage";
import { SocialSharePage } from "@/pages/SocialSharePage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";

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
        path: "/videos",
        element: <VideosPage />,
      },
      {
        path: "/coach",
        element: <CoachPage />,
      },
      {
        path: "/nutrition",
        element: <NutritionPage />,
      },
      {
        path: "/progress",
        element: <ProgressPage />,
      },
      {
        path: "/calendar",
        element: <CalendarPage />,
      },
      {
        path: "/planner",
        element: <PlannerPage />,
      },
      {
        path: "/habits",
        element: <HabitsPage />,
      },
      {
        path: "/mindfulness",
        element: <MindfulnessPage />,
      },
      {
        path: "/health",
        element: <HealthPage />,
      },
      {
        path: "/achievements",
        element: <AchievementsPage />,
      },
      {
        path: "/form-check",
        element: <FormCheckPage />,
      },
      {
        path: "/social",
        element: <SocialSharePage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
