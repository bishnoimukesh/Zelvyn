import { Sparkles, Dumbbell, ShieldAlert, Apple, Zap } from "lucide-react";

interface CoachQuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function CoachQuickPrompts({ onSelectPrompt }: CoachQuickPromptsProps) {
  const quickPrompts = [
    {
      icon: <Dumbbell className="h-3.5 w-3.5 text-[#C8FF47]" />,
      text: "Generate a 25-min HIIT core burner",
      category: "Workout",
    },
    {
      icon: <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />,
      text: "Alternative exercises for shoulder impingement",
      category: "Injury Mod",
    },
    {
      icon: <Apple className="h-3.5 w-3.5 text-emerald-400" />,
      text: "Calculate daily protein & calorie targets for 69.9kg",
      category: "Nutrition",
    },
    {
      icon: <Zap className="h-3.5 w-3.5 text-orange-400" />,
      text: "Optimal recovery protocol for sore hamstrings",
      category: "Recovery",
    },
    {
      icon: <Sparkles className="h-3.5 w-3.5 text-[#C8FF47]" />,
      text: "Analyze my progressive overload velocity",
      category: "Overload",
    },
  ];

  return (
    <div className="space-y-2" id="coach-quick-prompts-container">
      <div className="flex items-center gap-1.5 text-xs font-mono text-[#71717A] uppercase font-bold">
        <Sparkles className="h-3.5 w-3.5 text-[#C8FF47]" /> Quick Athletic Prompts
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            id={`quick-prompt-${idx}`}
            type="button"
            onClick={() => onSelectPrompt(item.text)}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181820] border border-[#262632] hover:border-[#C8FF47]/50 hover:bg-[#1E2218] transition-all text-left whitespace-nowrap flex-shrink-0"
          >
            <div className="flex-shrink-0">{item.icon}</div>
            <div className="text-xs">
              <span className="text-white group-hover:text-[#C8FF47] transition-colors font-medium">
                {item.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
