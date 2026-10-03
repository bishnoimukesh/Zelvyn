import { useState } from "react";
import {
  Layers,
  X,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  toggleTemplateModal,
  applySplitTemplate,
  applySplitTemplateAsync,
} from "@/features/planner/plannerSlice";

const DAY_KEYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const DAY_ABBR: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export function SplitTemplatesModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.planner.isTemplateModalOpen);
  const templates = useAppSelector((state) => state.planner.templates);
  const workouts = useAppSelector((state) => state.workouts.items);

  const [appliedId, setAppliedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(toggleTemplateModal(false));
    setAppliedId(null);
  };

  const handleApply = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    dispatch(applySplitTemplate(templateId));
    if (template) {
      dispatch(applySplitTemplateAsync({ template }));
    }
    setAppliedId(templateId);
    setTimeout(() => {
      dispatch(toggleTemplateModal(false));
      setAppliedId(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5 sm:p-6 bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-black uppercase text-foreground tracking-wide">
                Split Presets & Microcycles
              </h3>
              <p className="text-xs text-muted-foreground">
                Load science-backed training splits directly into your 7-day schedule
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Templates List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {templates.map((tpl) => {
            const isJustApplied = appliedId === tpl.id;

            return (
              <div
                key={tpl.id}
                className="rounded-2xl border border-border bg-muted/40 p-5 hover:border-primary/40 transition-all space-y-4"
              >
                {/* Top Row: Title + Tags + Apply Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display text-base font-black text-foreground">
                        {tpl.title}
                      </h4>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                        {tpl.category}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-cyan-500 border border-cyan-500/20">
                        {tpl.daysCount} Days / Week
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tpl.description}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleApply(tpl.id)}
                    className={`gap-1.5 text-xs font-bold shrink-0 transition-all ${
                      isJustApplied
                        ? "bg-cyan-500 text-black"
                        : "bg-primary text-primary-foreground hover:opacity-95 shadow-[0_0_12px_rgba(200,255,71,0.25)]"
                    }`}
                  >
                    {isJustApplied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Applied!
                      </>
                    ) : (
                      <>
                        Apply Preset <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                </div>

                {/* 7-Day Visual Mini Bar */}
                <div className="grid grid-cols-7 gap-1.5 pt-1">
                  {DAY_KEYS.map((dayName) => {
                    const dayItem = tpl.scheduleMap[dayName];
                    const workout = dayItem.workoutId
                      ? workouts.find((w) => w.id === dayItem.workoutId)
                      : null;

                    return (
                      <div
                        key={dayName}
                        className={`rounded-xl border p-2 text-center flex flex-col justify-between min-h-[58px] transition-colors ${
                          dayItem.isRestDay
                            ? "bg-card border-border text-muted-foreground"
                            : "bg-muted border-border text-foreground"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">
                          {DAY_ABBR[dayName]}
                        </span>
                        <div className="text-[9px] font-semibold leading-tight line-clamp-2 mt-1">
                          {dayItem.isRestDay ? (
                            <span className="text-muted-foreground">Rest</span>
                          ) : workout ? (
                            <span className="text-primary truncate block">
                              {workout.title.split(" ")[0]}
                            </span>
                          ) : (
                            <span className="text-primary">Train</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="border-t border-border p-4 bg-muted/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Applying a split updates your weekly schedule instantly.</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
