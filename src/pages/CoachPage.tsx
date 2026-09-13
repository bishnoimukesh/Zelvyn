import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiService } from "@/services/ai/openai";

export function CoachPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hello! I am your FitSync AI Coach. I can analyze your training fatigue, recommend recovery protocols, and generate custom progressive overload routines. What are we working on today?",
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-xl bg-[#C8FF47]/10 flex items-center justify-center text-[#C8FF47]">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-black uppercase text-white">
            FitSync AI Coach
          </h1>
          <p className="text-xs text-[#71717A]">
            Adaptive training & recovery intelligence
          </p>
        </div>
      </div>

      <Card className="h-[460px] flex flex-col justify-between p-4">
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
                    ? "bg-[#C8FF47] text-[#08080A] font-bold"
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
            placeholder="Ask your coach anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={loading || !input.trim()} className="font-bold">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
