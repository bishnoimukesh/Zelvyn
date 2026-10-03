import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  tickRestTimer,
  adjustRestTimer,
  stopRestTimer,
} from "@/features/workouts/workoutSessionSlice";
import { Button } from "@/components/ui/button";
import { FastForward, Plus, Minus, Timer, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";

export function RestTimer() {
  const dispatch = useAppDispatch();
  const restTimer = useAppSelector((state) => state.workoutSession.restTimer);

  // Interval timer hook
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (restTimer.isRunning && restTimer.remaining > 0) {
      interval = setInterval(() => {
        dispatch(tickRestTimer());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [restTimer.isRunning, restTimer.remaining, dispatch]);

  if (!restTimer.isRunning && restTimer.remaining === 0) {
    return null;
  }

  const minutes = Math.floor(restTimer.remaining / 60);
  const seconds = restTimer.remaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const progressPercent =
    restTimer.duration > 0
      ? Math.max(0, Math.min(100, (restTimer.remaining / restTimer.duration) * 100))
      : 0;

  const isLow = restTimer.remaining <= 5 && restTimer.remaining > 0;

  return (
    <div
      id="rest-timer-bar"
      className={cn(
        "sticky bottom-20 sm:bottom-6 z-40 mx-auto w-full max-w-md p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 shadow-2xl",
        isLow
          ? "bg-[#1E1212]/95 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.25)] animate-pulse"
          : "bg-[#121216]/95 border-[#C8FF47]/40 shadow-[0_0_30px_rgba(200,255,71,0.2)]"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Timer Icon & Time Remaining */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-11 w-11 rounded-xl flex items-center justify-center transition-colors",
              isLow
                ? "bg-red-500/20 text-red-400"
                : "bg-[#C8FF47]/20 text-[#C8FF47]"
            )}
          >
            {isLow ? (
              <BellRing className="h-6 w-6 animate-bounce" />
            ) : (
              <Timer className="h-6 w-6 animate-spin-slow" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] font-bold">
                Rest Interval
              </span>
              {isLow && (
                <span className="text-[10px] font-bold text-red-400 uppercase">
                  Ready!
                </span>
              )}
            </div>
            <div
              id="rest-timer-display"
              className={cn(
                "font-mono text-2xl font-black tracking-wider leading-none mt-0.5",
                isLow ? "text-red-400" : "text-[#C8FF47]"
              )}
            >
              {formattedTime}
            </div>
          </div>
        </div>

        {/* Adjust Buttons & Skip */}
        <div className="flex items-center gap-1.5">
          <Button
            id="rest-minus-15"
            size="sm"
            variant="outline"
            onClick={() => dispatch(adjustRestTimer(-15))}
            className="h-8 w-8 p-0 rounded-lg border-[#2A2A36] bg-[#181820] text-[#A1A1AA] hover:text-white hover:border-[#3F3F4E]"
            title="Subtract 15 seconds"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>

          <Button
            id="rest-plus-15"
            size="sm"
            variant="outline"
            onClick={() => dispatch(adjustRestTimer(15))}
            className="h-8 w-8 p-0 rounded-lg border-[#2A2A36] bg-[#181820] text-[#A1A1AA] hover:text-white hover:border-[#3F3F4E]"
            title="Add 15 seconds"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>

          <Button
            id="rest-skip-button"
            size="sm"
            onClick={() => dispatch(stopRestTimer())}
            className="h-8 px-3 rounded-lg bg-[#22222C] hover:bg-[#2C2C38] text-white text-xs font-semibold border border-[#333342] flex items-center gap-1"
          >
            <FastForward className="h-3.5 w-3.5" /> Skip
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#1F1F28] h-1.5 rounded-full mt-3 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300 rounded-full",
            isLow ? "bg-red-500" : "bg-[#C8FF47]"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
