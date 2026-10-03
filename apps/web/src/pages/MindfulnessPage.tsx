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
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
            Quick Start
          </span>
          <h3 className="font-display text-2xl font-black uppercase text-foreground tracking-wide mt-2">
            Box Breathing
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            4-4-4-4 · 5 minutes · Calm &amp; Focus
          </p>
        </div>

        <Button
          onClick={() => handleStartSession(SESSIONS[0])}
          className="gap-2 font-bold bg-primary text-primary-foreground hover:bg-primary/90 px-6 text-xs shadow-sm shrink-0 self-start sm:self-center"
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
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
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
              className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-sm"
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

                  <span className="text-xs font-mono text-muted-foreground">
                    {session.duration}
                  </span>
                </div>

                <h4 className="font-display text-base font-black text-foreground mt-3">
                  {session.title}
                </h4>

                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mt-0.5">
                  {session.category}
                </span>

                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {session.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleStartSession(session)}
                className="flex items-center gap-2 text-xs font-bold text-primary hover:underline pt-2"
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
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center space-y-6 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveSession(null);
                setIsPacing(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-xs uppercase font-bold text-primary tracking-widest">
                {activeSession.category}
              </span>
              <h3 className="font-display text-2xl font-black text-foreground mt-1">
                {activeSession.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Follow the visual pulse and breathe naturally
              </p>
            </div>

            {/* Breathing Circle Pacer */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`relative flex h-48 w-48 items-center justify-center rounded-full border-2 border-primary transition-all duration-1000 ${
                  phase === "Inhale"
                    ? "scale-110 bg-primary/20 shadow-lg"
                    : phase === "Hold"
                    ? "scale-105 bg-cyan-500/15 border-cyan-500 shadow-md"
                    : "scale-90 bg-primary/5 shadow-none"
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="font-display text-2xl font-black uppercase text-foreground tracking-widest">
                    {phase}
                  </span>
                  <span className="font-mono text-3xl font-black text-primary mt-1">
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
                className="h-12 w-12 rounded-full border-border bg-card text-foreground hover:bg-muted"
              >
                {isPacing ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
              </Button>
            </div>

            <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-primary" />
              <span>Ambient audio soothing track active</span>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
