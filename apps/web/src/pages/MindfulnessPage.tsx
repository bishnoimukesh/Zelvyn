import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  X,
  Wind,
  Zap,
  Sun,
  Brain,
  Moon,
  Volume2,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";

interface MindfulnessSession {
  id: string;
  title: string;
  category: "Breathing" | "Meditation" | "Focus" | "Recovery" | "Sleep";
  duration: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const SESSIONS: MindfulnessSession[] = [
  {
    id: "s-1",
    title: "Box Breathing",
    category: "Breathing",
    duration: "5 min",
    description: "4-4-4-4 breathing pattern to calm the nervous system.",
    icon: Wind,
    color: "#00F0FF",
  },
  {
    id: "s-2",
    title: "Pre-Workout Focus",
    category: "Focus",
    duration: "3 min",
    description:
      "Energize your mind before training with a power focus session.",
    icon: Zap,
    color: "#C8FF47",
  },
  {
    id: "s-3",
    title: "Morning Meditation",
    category: "Meditation",
    duration: "10 min",
    description: "Start your day with clarity and intention.",
    icon: Sun,
    color: "#FF8438",
  },
  {
    id: "s-4",
    title: "Post-Workout Recovery",
    category: "Recovery",
    duration: "7 min",
    description:
      "Wind down and relax after an intense training session.",
    icon: Brain,
    color: "#A78BFA",
  },
  {
    id: "s-5",
    title: "Sleep Preparation",
    category: "Sleep",
    duration: "12 min",
    description:
      "Guided relaxation to improve sleep onset and quality.",
    icon: Moon,
    color: "#38BDF8",
  },
  {
    id: "s-6",
    title: "4-7-8 Breathing",
    category: "Breathing",
    duration: "4 min",
    description:
      "Reduce anxiety and stress with this breathing technique.",
    icon: Wind,
    color: "#34D399",
  },
];

export function MindfulnessPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeSession, setActiveSession] = useState<MindfulnessSession | null>(
    null
  );
  const [isPacing, setIsPacing] = useState(false);
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [countdown, setCountdown] = useState(4);

  // Breathing pacer loop
  useEffect(() => {
    if (!isPacing) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;

        // Advance phase
        setPhase((currentPhase) => {
          if (currentPhase === "Inhale") return "Hold";
          if (currentPhase === "Hold") return "Exhale";
          return "Inhale";
        });
        return 4;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPacing]);

  const handleStartSession = (session: MindfulnessSession) => {
    setActiveSession(session);
    setIsPacing(true);
    setPhase("Inhale");
    setCountdown(4);
  };

  const filteredSessions =
    selectedCategory === "All"
      ? SESSIONS
      : SESSIONS.filter((s) => s.category === selectedCategory);

  return (
    <PageContainer
      title="Mindfulness"
      description="Breathe, focus, recover, and recharge"
      badge="Mind & Recovery"
    >
      {/* Quick Start Hero Card */}
      <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C8FF47] bg-[#C8FF47]/10 px-2 py-0.5 rounded border border-[#C8FF47]/20">
            Quick Start
          </span>
          <h3 className="font-display text-2xl font-black uppercase text-white tracking-wide mt-2">
            Box Breathing
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-1">
            4-4-4-4 · 5 minutes · Calm &amp; Focus
          </p>
        </div>

        <Button
          onClick={() => handleStartSession(SESSIONS[0])}
          className="gap-2 font-bold bg-[#C8FF47] text-black hover:bg-[#b5eb38] px-6 text-xs shadow-[0_0_15px_rgba(200,255,71,0.25)] shrink-0 self-start sm:self-center"
        >
          <Play className="h-4 w-4 fill-current" /> Start
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {["All", "Breathing", "Meditation", "Focus", "Recovery", "Sleep"].map(
          (cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-[#C8FF47] text-black shadow-[0_0_12px_rgba(200,255,71,0.25)]"
                  : "bg-[#141418] text-[#A1A1AA] hover:text-white hover:bg-[#1A1A22] border border-[#222228]"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSessions.map((session) => {
          const Icon = session.icon;

          return (
            <div
              key={session.id}
              className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-5 flex flex-col justify-between space-y-4 hover:border-[#2E2E38] transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${session.color}15`,
                      borderColor: `${session.color}30`,
                      color: session.color,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-mono text-[#71717A]">
                    {session.duration}
                  </span>
                </div>

                <h4 className="font-display text-base font-black text-white mt-3">
                  {session.title}
                </h4>

                <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider block mt-0.5">
                  {session.category}
                </span>

                <p className="text-xs text-[#71717A] mt-2 leading-relaxed">
                  {session.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleStartSession(session)}
                className="flex items-center gap-2 text-xs font-bold text-[#C8FF47] hover:underline pt-2"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Play</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Breathing / Meditation Modal Player */}
      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 text-center space-y-6 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveSession(null);
                setIsPacing(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#71717A] hover:bg-[#1E1E24] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-xs uppercase font-bold text-[#C8FF47] tracking-widest">
                {activeSession.category}
              </span>
              <h3 className="font-display text-2xl font-black text-white mt-1">
                {activeSession.title}
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Follow the visual pulse and breathe naturally
              </p>
            </div>

            {/* Breathing Circle Pacer */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`relative flex h-48 w-48 items-center justify-center rounded-full border-2 border-[#C8FF47] transition-all duration-1000 ${
                  phase === "Inhale"
                    ? "scale-110 bg-[#C8FF47]/20 shadow-[0_0_40px_rgba(200,255,71,0.4)]"
                    : phase === "Hold"
                    ? "scale-105 bg-[#00F0FF]/15 border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                    : "scale-90 bg-[#C8FF47]/5 shadow-none"
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="font-display text-2xl font-black uppercase text-white tracking-widest">
                    {phase}
                  </span>
                  <span className="font-mono text-3xl font-black text-[#C8FF47] mt-1">
                    {countdown}s
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPacing(!isPacing)}
                className="h-12 w-12 rounded-full border-[#222228] bg-[#16161A] text-white hover:bg-[#1C1C24]"
              >
                {isPacing ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
              </Button>
            </div>

            <div className="text-[11px] text-[#71717A] flex items-center justify-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-[#C8FF47]" />
              <span>Ambient audio soothing track active</span>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
