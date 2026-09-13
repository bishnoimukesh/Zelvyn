import { PageContainer } from "@/components/layout/PageContainer";
import { CoachChatInterface } from "@/components/coach/CoachChatInterface";
import { CoachQuickPrompts } from "@/components/coach/CoachQuickPrompts";
import { CoachRecoveryWidget } from "@/components/coach/CoachRecoveryWidget";
import { useAppDispatch } from "@/app/hooks";
import { addUserMessage, addAssistantMessage } from "@/features/coach/coachSlice";
import { aiService } from "@/services/ai/openai";

export function CoachPage() {
  const dispatch = useAppDispatch();

  const handleSelectQuickPrompt = async (promptText: string) => {
    dispatch(addUserMessage(promptText));
    try {
      const response = await aiService.sendMessage(promptText, []);
      dispatch(
        addAssistantMessage({
          text: response.text,
          category: response.category,
          generatedWorkout: response.generatedWorkout,
          suggestedPrompts: response.suggestedPrompts,
        })
      );
    } catch {
      dispatch(
        addAssistantMessage({
          text: "I experienced an error analyzing your request. Please try asking again.",
          category: "general",
        })
      );
    }
  };

  return (
    <PageContainer
      title="FitSync AI Athletic Coach"
      description="Adaptive sports science intelligence continuously analyzing your training volume, CNS readiness, and progressive overload trajectory."
      badge="AI Intelligence Active"
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
