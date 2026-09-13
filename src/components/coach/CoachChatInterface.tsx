import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addUserMessage,
  addAssistantMessage,
  clearChatHistory,
} from "@/features/coach/coachSlice";
import { aiService, AIChatMessage } from "@/services/ai/openai";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, Sparkles, Trash2, User } from "lucide-react";
import { GeneratedWorkoutCard } from "@/components/coach/GeneratedWorkoutCard";

interface CoachChatInterfaceProps {
  onSelectPrompt?: (prompt: string) => void;
}

export function CoachChatInterface({ onSelectPrompt }: CoachChatInterfaceProps) {
  const dispatch = useAppDispatch();
  const { messages, isTyping } = useAppSelector((state) => state.coach);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    setInput("");
    dispatch(addUserMessage(query));

    // Convert Redux messages to history
    const history: AIChatMessage[] = messages.map((m) => ({
      role: m.sender,
      content: m.text,
    }));

    try {
      const response = await aiService.sendMessage(query, history);
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

  const handlePromptClick = (prompt: string) => {
    if (onSelectPrompt) {
      onSelectPrompt(prompt);
    }
    handleSendMessage(prompt);
  };

  return (
    <Card
      id="coach-chat-card"
      className="flex flex-col h-[650px] border-[#222228] bg-[#121216] relative overflow-hidden"
    >
      {/* Chat Header */}
      <div className="p-4 bg-[#14141A] border-b border-[#222228] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-2xl bg-[#1C2214] border border-[#C8FF47]/40 text-[#C8FF47] flex items-center justify-center shadow-[0_0_15px_rgba(200,255,71,0.2)]">
              <Bot className="h-5 w-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#C8FF47] border-2 border-[#121216]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wide">
                FitSync Athletic AI
              </span>
              <Badge className="bg-[#C8FF47]/10 text-[#C8FF47] border-[#C8FF47]/20 text-[10px] font-mono uppercase">
                Active Telemetry
              </Badge>
            </div>
            <span className="text-[11px] text-[#71717A] block font-mono">
              Biometrics synced: 69.9 kg · 7-Day Streak · 88% Readiness
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(clearChatHistory())}
          className="h-8 px-2.5 text-[#71717A] hover:text-red-400 hover:bg-red-500/10 text-xs font-mono"
          title="Reset conversation"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" /> Reset
        </Button>
      </div>

      {/* Message Stream */}
      <div
        id="coach-messages-stream"
        className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${
              m.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.sender === "assistant" && (
              <div className="h-8 w-8 rounded-xl bg-[#181C14] border border-[#C8FF47]/40 text-[#C8FF47] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
            )}

            <div className="max-w-[85%] sm:max-w-[80%] space-y-2">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#C8FF47] text-black font-semibold rounded-tr-none shadow-[0_0_15px_rgba(200,255,71,0.2)] ml-auto"
                    : "bg-[#181820] text-[#E4E4E7] border border-[#262632] rounded-tl-none whitespace-pre-line"
                }`}
              >
                {m.text}
              </div>

              {/* Embed Generated Workout Card if present */}
              {m.generatedWorkout && (
                <GeneratedWorkoutCard workout={m.generatedWorkout} />
              )}

              {/* Interactive Follow-up Suggestion Chips */}
              {m.suggestedPrompts && m.suggestedPrompts.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {m.suggestedPrompts.map((pText, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handlePromptClick(pText)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-[#15171C] border border-[#2A2E3C] text-[#A1A1AA] hover:text-[#C8FF47] hover:border-[#C8FF47]/40 hover:bg-[#1A2016] transition-colors"
                    >
                      • {pText}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {m.sender === "user" && (
              <div className="h-8 w-8 rounded-xl bg-[#22222C] text-white flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#333342]">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 justify-start items-center">
            <div className="h-8 w-8 rounded-xl bg-[#181C14] border border-[#C8FF47]/40 text-[#C8FF47] flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#181820] border border-[#262632] rounded-tl-none flex items-center gap-1.5 text-xs text-[#A1A1AA] font-mono">
              <span className="text-[#C8FF47] font-bold">FitSync AI</span> is
              analyzing telemetry
              <span className="flex gap-1 ml-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8FF47] animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8FF47] animate-bounce delay-150" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8FF47] animate-bounce delay-300" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-[#14141A] border-t border-[#222228] flex items-center gap-2"
      >
        <Input
          id="coach-chat-input"
          type="text"
          placeholder="Ask Coach Alex anything (e.g. adjust volume, generate routine, macro targets)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="flex-1 bg-[#181820] border-[#2A2A36] text-white text-xs sm:text-sm placeholder:text-[#52525B] focus:border-[#C8FF47] rounded-xl py-5"
        />

        <Button
          id="coach-send-btn"
          type="submit"
          disabled={isTyping || !input.trim()}
          className="bg-[#C8FF47] text-black font-black uppercase text-xs hover:bg-[#b5f030] shadow-[0_0_15px_rgba(200,255,71,0.25)] rounded-xl py-5 px-4 flex items-center gap-1.5 flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
