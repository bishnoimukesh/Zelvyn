import { Calendar, CalendarDays, Bell, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setActiveView,
  toggleReminderModal,
  toggleTemplateModal,
} from "@/features/planner/plannerSlice";

export function ScheduleHeaderControls() {
  const dispatch = useAppDispatch();
  const activeView = useAppSelector((state) => state.planner.activeView);
  const reminderSettings = useAppSelector(
    (state) => state.planner.reminderSettings
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
      {/* View Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border rounded-xl self-start">
        <button
          type="button"
          onClick={() => dispatch(setActiveView("week"))}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeView === "week"
              ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(200,255,71,0.3)]"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <CalendarDays className="h-3.5 w-3.5" />
          <span>7-Day Microcycle</span>
        </button>

        <button
          type="button"
          onClick={() => dispatch(setActiveView("month"))}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeView === "month"
              ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(200,255,71,0.3)]"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Month Calendar</span>
        </button>
      </div>

      {/* Action Buttons: Split Templates & Reminders */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(toggleTemplateModal(true))}
          className="gap-2 text-xs font-semibold bg-card border-border hover:border-primary/40 text-foreground"
        >
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span>Split Presets</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(toggleReminderModal(true))}
          className="gap-2 text-xs font-semibold bg-card border-border hover:border-primary/40 text-foreground relative"
        >
          <Bell className="h-3.5 w-3.5 text-cyan-500" />
          <span>Reminders & Sync</span>
          {reminderSettings.enabled && (
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-500 border border-cyan-500/30 ml-1">
              {reminderSettings.time}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
