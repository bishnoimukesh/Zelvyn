import { useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CoachChatInterface } from "@/components/coach/CoachChatInterface";
import { CoachQuickPrompts } from "@/components/coach/CoachQuickPrompts";
import { CoachRecoveryWidget } from "@/components/coach/CoachRecoveryWidget";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchCoachHistory, sendCoachMessageAsync } from "@/features/coach/coachSlice";

export function CoachPage() {
  const dispatch = useAppDispatch();
  const isLiveSynced = useAppSelector((state) => state.coach.isLiveSynced);

  useEffect(() => {
    dispatch(fetchCoachHistory("demo-user-1"));
  }, [dispatch]);

  const handleSelectQuickPrompt = async (promptText: string) => {
    dispatch(sendCoachMessageAsync({ userId: "demo-user-1", message: promptText }));
  };

  return (
    <PageContainer
      title="FitSync AI Athletic Coach"
      description="Adaptive sports science intelligence continuously analyzing your training volume, CNS readiness, and progressive overload trajectory."
      badge={isLiveSynced ? "MongoDB Atlas Synced" : "AI Intelligence Active"}
    >
      <div className="space-y-4" id="coach-page-container">
        {/* Quick Categorized Prompts Strip */}
        <CoachQuickPrompts onSelectPrompt={handleSelectQuickPrompt} />

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Chat Interface (2 cols) */}
          <div className="lg:col-span-2">
            <CoachChatInterface onSelectPrompt={handleSelectQuickPrompt} />
          </div>

          {/* Right Column: Recovery & Readiness Widget (1 col) */}
          <div>
            <CoachRecoveryWidget />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
