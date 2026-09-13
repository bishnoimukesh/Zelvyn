import { useState } from "react";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiService } from "@/services/ai/openai";
import { PageContainer } from "@/components/layout/PageContainer";

export function CoachPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hello Alex! I am your FitSync AI Coach. I can analyze your training fatigue, recommend recovery protocols, and generate custom progressive overload routines. What are we working on today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const reply = await aiService.sendMessage(userText, messages);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "AI Coach is currently offline. Ready for Phase 9 integration." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="FitSync AI Coach"
      description="Adaptive intelligence analyzing your training volume, recovery scores, and fatigue."
      badge="AI Active"
    >
      <Card className="h-[480px] flex flex-col justify-between p-4 border-[#222228]">
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#C8FF47] text-[#08080A] font-bold shadow-[0_0_12px_rgba(200,255,71,0.2)]"
                    : "bg-[#1A1A1F] text-[#F2F2F5] border border-[#222228]"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 pt-3 border-t border-[#222228]"
        >
          <Input
            placeholder="Ask your coach anything (e.g. adjust today's workout for shoulder fatigue)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={loading || !input.trim()} className="font-bold">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}
