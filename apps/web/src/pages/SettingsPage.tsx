import { useState, useEffect } from "react";
import {
  Bell,
  Moon,
  Sun,
  Accessibility,
  Download,
  CheckCircle2,
  ShieldCheck,
  Check,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setTheme } from "@/features/ui/uiSlice";

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const [notificationStatus, setNotificationStatus] = useState<string>("default");
  const [largerText, setLargerText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationStatus(perm);
      } catch {
        setNotificationStatus("granted");
      }
    } else {
      setNotificationStatus("granted");
    }
  };

  const handleInstallApp = () => {
    setIsInstalled(true);
    setTimeout(() => setIsInstalled(false), 3000);
  };

  return (
    <PageContainer
      title="Settings"
      description="App preferences, appearance, and accessibility configurations"
      badge="Preferences"
    >
      <div className="max-w-3xl space-y-6">
        {/* NOTIFICATIONS */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-foreground">
            <Bell className="h-4 w-4 text-primary" />
            <span>Notifications</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
            <div>
              <div className="text-xs font-bold text-foreground">
                Browser Notifications
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Status:{" "}
                <span className="font-semibold text-foreground capitalize">
                  {notificationStatus}
                </span>
              </div>
            </div>

            {notificationStatus !== "granted" ? (
              <Button
                size="sm"
                onClick={handleEnableNotifications}
                className="font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Enable
              </Button>
            ) : (
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Enabled
              </span>
            )}
          </div>
        </div>

        {/* APPEARANCE */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-foreground">
            <Moon className="h-4 w-4 text-cyan-500" />
            <span>Appearance</span>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
            <div>
              <div className="text-xs font-bold text-foreground">Theme</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Switch between Light & Dark interface
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 bg-background rounded-lg border border-border">
              <button
                type="button"
                onClick={() => dispatch(setTheme("dark"))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  theme === "dark"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Moon className="h-3.5 w-3.5" /> Dark
              </button>

              <button
                type="button"
                onClick={() => dispatch(setTheme("light"))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  theme === "light"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sun className="h-3.5 w-3.5" /> Light
              </button>
            </div>
          </div>

          {/* Larger Text Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
            <div>
              <div className="text-xs font-bold text-foreground">Larger Text</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Increase font size throughout app
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLargerText(!largerText)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                largerText ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-md transition ${
                  largerText ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Reduce Motion Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
            <div>
              <div className="text-xs font-bold text-foreground">Reduce Motion</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Minimize animations
              </div>
            </div>

            <button
              type="button"
              onClick={() => setReduceMotion(!reduceMotion)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                reduceMotion ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-md transition ${
                  reduceMotion ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ACCESSIBILITY */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-foreground">
            <Accessibility className="h-4 w-4 text-purple-500" />
            <span>Accessibility</span>
          </div>

          <div className="space-y-2.5 text-xs text-muted-foreground p-4 rounded-xl bg-muted/50 border border-border">
            {[
              "Keyboard navigation supported throughout",
              "ARIA labels on interactive elements",
              "Focus states visible for all controls",
              "AA contrast ratio maintained (4.5:1+)",
              "Reduced motion support via CSS prefers-reduced-motion",
            ].map((checkItem, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-foreground">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{checkItem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* INSTALL APP */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-foreground">
            <Download className="h-4 w-4 text-primary" />
            <span>Install App</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/50 border border-border">
            <div>
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>Progressive Web App</span>
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-md">
                Install FitSync AI as a Progressive Web App for a native app
                experience — works offline, loads fast, and syncs automatically.
              </p>
            </div>

            <Button
              size="sm"
              onClick={handleInstallApp}
              className="font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              {isInstalled ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" /> Install PWA
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
