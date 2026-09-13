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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222228]">
      {/* View Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#16161A] border border-[#222228] rounded-xl self-start">
        <button
          type="button"
          onClick={() => dispatch(setActiveView("week"))}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeView === "week"
              ? "bg-[#C8FF47] text-black shadow-[0_0_12px_rgba(200,255,71,0.3)]"
              : "text-[#A1A1AA] hover:text-white hover:bg-[#1E1E24]"
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
              ? "bg-[#C8FF47] text-black shadow-[0_0_12px_rgba(200,255,71,0.3)]"
              : "text-[#A1A1AA] hover:text-white hover:bg-[#1E1E24]"
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
          className="gap-2 text-xs font-semibold bg-[#16161A] border-[#222228] hover:border-[#C8FF47]/40 text-white"
        >
          <Layers className="h-3.5 w-3.5 text-[#C8FF47]" />
          <span>Split Presets</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(toggleReminderModal(true))}
          className="gap-2 text-xs font-semibold bg-[#16161A] border-[#222228] hover:border-[#C8FF47]/40 text-white relative"
        >
          <Bell className="h-3.5 w-3.5 text-[#00F0FF]" />
          <span>Reminders & Sync</span>
          {reminderSettings.enabled && (
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 ml-1">
              {reminderSettings.time}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
