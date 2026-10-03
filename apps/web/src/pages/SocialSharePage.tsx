import { useState } from "react";
import {
  Share2,
  Download,
  Flame,
  Zap,
  Trophy,
  TrendingDown,
  Check,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";

interface Milestone {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  quote: string;
  color: string;
}

const MILESTONES: Milestone[] = [
  {
    id: "streak",
    label: "Current Streak",
    value: "12 DAYS",
    icon: Flame,
    quote: "Consistency is the key to transformation",
    color: "#C8FF47",
  },
  {
    id: "workouts",
    label: "Workouts This Month",
    value: "8 SESSIONS",
    icon: Zap,
    quote: "Every rep moves the needle forward",
    color: "#00F0FF",
  },
  {
    id: "pr",
    label: "New Personal Record",
    value: "100 kg",
    icon: Trophy,
    quote: "Breaking barriers, one set at a time",
    color: "#FF8438",
  },
  {
    id: "weight",
    label: "Weight Lost",
    value: "4.0 KG",
    icon: TrendingDown,
    quote: "Discipline equals long-term athletic freedom",
    color: "#34D399",
  },
];

export function SocialSharePage() {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState("streak");
  const [copied, setCopied] = useState(false);

  const activeMilestone =
    MILESTONES.find((m) => m.id === selectedMilestoneId) || MILESTONES[0];
  const Icon = activeMilestone.icon;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FitSync: ${activeMilestone.label} - ${activeMilestone.value}`,
          text: `I just hit ${activeMilestone.value} on FitSync! "${activeMilestone.quote}"`,
          url: window.location.origin,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(
        `FitSync Milestone: ${activeMilestone.value} - ${activeMilestone.quote} via fitsync.ai`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSave = () => {
    navigator.clipboard.writeText(
      `FitSync Milestone: ${activeMilestone.value} - ${activeMilestone.quote} via fitsync.ai`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <PageContainer
      title="Share Milestone"
      description="Celebrate your achievements and inspire others"
      badge="Social Sharing"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Select Milestone */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
            Select Milestone
          </h4>

          <div className="space-y-3">
            {MILESTONES.map((m) => {
              const MilestoneIcon = m.icon;
              const isSelected = selectedMilestoneId === m.id;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMilestoneId(m.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-primary/10 border-primary shadow-sm ring-1 ring-primary"
                      : "bg-card border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${m.color}15`,
                      borderColor: `${m.color}30`,
                      color: m.color,
                    }}
                  >
                    <MilestoneIcon className="h-6 w-6" />
                  </div>

                  <div>
                    <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider block">
                      {m.label}
                    </span>
                    <span className="font-display text-lg font-black text-foreground mt-0.5 block">
                      {m.value}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Card Preview & Share Buttons */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
            Preview
          </h4>

          {/* Social Graphic Card */}
          <div className="relative rounded-3xl border border-border bg-card p-8 text-center space-y-6 shadow-xl overflow-hidden">
            {/* Background glowing watermark */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* FitSync Header */}
            <div className="flex items-center justify-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-black">
                <Zap className="h-3.5 w-3.5 fill-current" />
              </div>
              <span className="font-display text-xs font-black uppercase tracking-widest text-foreground">
                FITSYNC <span className="text-primary">AI</span>
              </span>
            </div>

            {/* Icon In Glow */}
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary shadow-sm mx-auto">
              <Icon className="h-10 w-10" />
            </div>

            {/* Value & Label */}
            <div>
              <span className="text-xs uppercase font-black tracking-widest text-muted-foreground block">
                {activeMilestone.label}
              </span>
              <h3 className="font-display text-4xl sm:text-5xl font-black text-foreground tracking-wide mt-1">
                {activeMilestone.value}
              </h3>
              <p className="text-xs text-muted-foreground italic mt-3 max-w-xs mx-auto">
                &ldquo;{activeMilestone.quote}&rdquo;
              </p>
            </div>

            {/* User Footer */}
            <div className="pt-4 border-t border-border flex items-center justify-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Alex Rivera"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/40"
              />
              <span className="text-xs font-bold text-foreground">Alex Rivera</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleShare}
              className="flex-1 gap-2 font-bold bg-primary text-primary-foreground hover:bg-primary/90 text-xs py-2.5 shadow-sm"
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>

            <Button
              variant="outline"
              onClick={handleSave}
              className="gap-2 text-xs font-semibold bg-card border-border text-foreground hover:border-primary py-2.5"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-primary" /> Copied!
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 text-primary" /> Save
                </>
              )}
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            Uses Web Share API when available
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
