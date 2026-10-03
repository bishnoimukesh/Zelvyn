import { useState } from "react";
import {
  Bell,
  Clock,
  Download,
  CheckCircle2,
  X,
  Sparkles,
  Calendar,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  toggleReminderModal,
  updateReminderSettings,
  saveReminderSettingsAsync,
} from "@/features/planner/plannerSlice";

export function ReminderSettingsModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.planner.isReminderModalOpen);
  const settings = useAppSelector((state) => state.planner.reminderSettings);
  const monthDays = useAppSelector((state) => state.planner.monthDays);
  const workouts = useAppSelector((state) => state.workouts.items);

  const [exportSuccess, setExportSuccess] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "granted"
  );

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(toggleReminderModal(false));
    setExportSuccess(false);
  };

  const handleToggleEnabled = (enabled: boolean) => {
    dispatch(updateReminderSettings({ enabled }));
    dispatch(saveReminderSettingsAsync({ settings: { enabled } }));
  };

  const handleTimeChange = (time: string) => {
    dispatch(updateReminderSettings({ time }));
    dispatch(saveReminderSettingsAsync({ settings: { time } }));
  };

  const handleLeadTimeChange = (leadTimeMinutes: number) => {
    dispatch(updateReminderSettings({ leadTimeMinutes }));
    dispatch(saveReminderSettingsAsync({ settings: { leadTimeMinutes } }));
  };

  const handleToggleRestDayAlert = (notifyRestDays: boolean) => {
    dispatch(updateReminderSettings({ notifyRestDays }));
    dispatch(saveReminderSettingsAsync({ settings: { notifyRestDays } }));
  };

  const handleRequestPushPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationStatus(perm);
        dispatch(
          updateReminderSettings({
            pushPermission:
              perm === "granted" || perm === "denied" ? perm : "default",
          })
        );
      } catch {
        setNotificationStatus("granted");
        dispatch(updateReminderSettings({ pushPermission: "granted" }));
      }
    } else {
      setNotificationStatus("granted");
      dispatch(updateReminderSettings({ pushPermission: "granted" }));
    }
  };

  // Generate and download iCalendar (.ics) RFC 5545 file
  const handleExportICalendar = () => {
    const timeParts = settings.time.split(":");
    const hours = timeParts[0] || "07";
    const minutes = timeParts[1] || "30";

    const scheduledDays = monthDays.filter(
      (d) => d.isCurrentMonth && d.workoutId
    );

    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//FitSync//Workout Planner//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:FitSync Training Schedule",
      "X-WR-TIMEZONE:UTC",
    ].join("\r\n");

    const nowIso = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

    scheduledDays.forEach((day) => {
      const workout = workouts.find((w) => w.id === day.workoutId);
      const title = workout ? workout.title : "Workout Session";
      const durationMin = workout ? workout.duration : 45;
      const desc = workout
        ? `${workout.description || "Training session"} (${workout.category} - ${workout.difficulty})`
        : "FitSync Scheduled Session";

      // Date string: YYYY-MM-DD
      const dateNoHyphen = day.dateString.replace(/-/g, "");
      const dtStart = `${dateNoHyphen}T${hours.padStart(2, "0")}${minutes.padStart(2, "0")}00`;

      // End time calc
      const startMinutesTotal = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
      const endMinutesTotal = startMinutesTotal + durationMin;
      const endHours = Math.floor(endMinutesTotal / 60) % 24;
      const endMins = endMinutesTotal % 60;
      const dtEnd = `${dateNoHyphen}T${String(endHours).padStart(2, "0")}${String(endMins).padStart(2, "0")}00`;

      icsContent += "\r\n" + [
        "BEGIN:VEVENT",
        `UID:fitsync-${day.dateString}-${day.workoutId}@fitsync.ai`,
        `DTSTAMP:${nowIso}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:FitSync: ${title}`,
        `DESCRIPTION:${desc}`,
        "LOCATION:FitSync Athletic Hub",
        "STATUS:CONFIRMED",
        "BEGIN:VALARM",
        `TRIGGER:-PT${settings.leadTimeMinutes}M`,
        "ACTION:DISPLAY",
        `DESCRIPTION:Upcoming FitSync Workout: ${title}`,
        "END:VALARM",
        "END:VEVENT",
      ].join("\r\n");
    });

    icsContent += "\r\nEND:VCALENDAR";

    // Trigger browser file download
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "fitsync_schedule_sep2026.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-black uppercase text-foreground tracking-wide">
                Workout Reminders & Sync
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure alerts and export to Apple / Google Calendar
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

        {/* Content Body */}
        <div className="mt-5 space-y-5">
          {/* Daily Alert Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/50">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>Daily Workout Alerts</span>
                {settings.enabled && (
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Receive prompt reminders before each scheduled training session
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleToggleEnabled(!settings.enabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                  settings.enabled ? "translate-x-5 bg-primary-foreground" : "translate-x-0 bg-muted-foreground"
                }`}
              />
            </button>
          </div>

          {/* Time Picker & Lead Time */}
          {settings.enabled && (
            <div className="space-y-4 rounded-xl border border-border bg-muted/40 p-4">
              <div>
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-2">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Target Workout Time</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={settings.time}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["06:30", "07:30", "17:30", "19:00"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleTimeChange(preset)}
                        className={`text-[11px] px-2.5 py-1 rounded-md border font-medium transition-all ${
                          settings.time === preset
                            ? "bg-primary/15 text-primary border-primary/40 font-bold"
                            : "bg-card text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-2 block">
                  Alert Lead Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "15 min before", value: 15 },
                    { label: "30 min before", value: 30 },
                    { label: "1 hour before", value: 60 },
                  ].map((lead) => (
                    <button
                      key={lead.value}
                      type="button"
                      onClick={() => handleLeadTimeChange(lead.value)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                        settings.leadTimeMinutes === lead.value
                          ? "bg-cyan-500/15 text-cyan-500 border-cyan-500/40 font-bold"
                          : "bg-card text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {lead.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rest day alerts toggle */}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    Rest Day Mobility Reminders
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Notify to hydrate and stretch on scheduled rest days
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleToggleRestDayAlert(!settings.notifyRestDays)
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    settings.notifyRestDays ? "bg-cyan-500" : "bg-muted"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow transition ${
                      settings.notifyRestDays ? "translate-x-4 bg-white" : "translate-x-0 bg-muted-foreground"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Browser Push Permission State */}
          <div className="rounded-xl border border-border bg-muted/40 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span>Browser Push Notifications</span>
                  {notificationStatus === "granted" && (
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Status:{" "}
                  <span className="capitalize font-semibold text-foreground">
                    {notificationStatus}
                  </span>
                </div>
              </div>
            </div>

            {notificationStatus !== "granted" ? (
              <Button
                size="sm"
                onClick={handleRequestPushPermission}
                className="text-xs font-bold bg-primary text-primary-foreground hover:opacity-95"
              >
                Enable Push
              </Button>
            ) : (
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active
              </span>
            )}
          </div>

          {/* Export to Calendar (.ics) Section */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-black uppercase text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Calendar Sync (.ics)</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Export all September 2026 workout sessions directly to Apple Calendar, Google Calendar, or Outlook.
                </p>
              </div>
            </div>

            <Button
              onClick={handleExportICalendar}
              className="w-full gap-2 font-bold bg-card hover:bg-muted text-foreground border border-border hover:border-primary"
            >
              <Download className="h-4 w-4 text-primary" />
              Export Schedule (.ics)
            </Button>

            {exportSuccess && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold border border-primary/30 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>fitsync_schedule_sep2026.ics downloaded successfully!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" />
            Background Sync Enabled
          </span>
          <Button
            onClick={handleClose}
            className="font-bold bg-primary text-primary-foreground hover:opacity-95 px-5 text-xs"
          >
            Save & Done
          </Button>
        </div>
      </div>
    </div>
  );
}
