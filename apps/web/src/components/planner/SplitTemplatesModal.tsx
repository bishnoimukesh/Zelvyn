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
    dispatch(applySplitTemplate(templateId));
    setAppliedId(templateId);
    setTimeout(() => {
      dispatch(toggleTemplateModal(false));
      setAppliedId(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-[#222228] bg-[#111114] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222228] p-5 sm:p-6 bg-[#16161A]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8FF47]/10 text-[#C8FF47] border border-[#C8FF47]/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-wide">
                Split Presets & Microcycles
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Load science-backed training splits directly into your 7-day schedule
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[#71717A] hover:bg-[#1E1E24] hover:text-white transition-colors"
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
                className="rounded-2xl border border-[#222228] bg-[#16161A] p-5 hover:border-[#383842] transition-all space-y-4"
              >
                {/* Top Row: Title + Tags + Apply Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display text-base font-black text-white">
                        {tpl.title}
                      </h4>
                      <span className="rounded-md bg-[#1E1E24] px-2 py-0.5 text-[10px] font-bold text-[#C8FF47] border border-[#C8FF47]/20">
                        {tpl.category}
                      </span>
                      <span className="rounded-md bg-[#1E1E24] px-2 py-0.5 text-[10px] font-bold text-[#00F0FF] border border-[#00F0FF]/20">
                        {tpl.daysCount} Days / Week
                      </span>
                    </div>
                    <p className="text-xs text-[#A1A1AA] mt-1">
                      {tpl.description}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleApply(tpl.id)}
                    className={`gap-1.5 text-xs font-bold shrink-0 transition-all ${
                      isJustApplied
                        ? "bg-[#00F0FF] text-black"
                        : "bg-[#C8FF47] text-black hover:bg-[#b5eb38] shadow-[0_0_12px_rgba(200,255,71,0.25)]"
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
                            ? "bg-[#111114]/70 border-[#222228] text-[#71717A]"
                            : "bg-[#1A1A22] border-[#2A2A38] text-white"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-[#A1A1AA]">
                          {DAY_ABBR[dayName]}
                        </span>
                        <div className="text-[9px] font-semibold leading-tight line-clamp-2 mt-1">
                          {dayItem.isRestDay ? (
                            <span className="text-[#71717A]">Rest</span>
                          ) : workout ? (
                            <span className="text-[#C8FF47] truncate block">
                              {workout.title.split(" ")[0]}
                            </span>
                          ) : (
                            <span className="text-[#C8FF47]">Train</span>
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
        <div className="border-t border-[#222228] p-4 bg-[#16161A] flex items-center justify-between text-xs text-[#A1A1AA]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#C8FF47]" />
            <span>Applying a split updates your weekly schedule instantly.</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-xs text-[#A1A1AA] hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
