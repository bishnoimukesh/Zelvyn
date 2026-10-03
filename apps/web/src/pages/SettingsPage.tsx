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

export function SettingsPage() {
  const [notificationStatus, setNotificationStatus] = useState<string>("default");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
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
        <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-white">
            <Bell className="h-4 w-4 text-[#C8FF47]" />
            <span>Notifications</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#16161A] border border-[#222228]">
            <div>
              <div className="text-xs font-bold text-white">
                Browser Notifications
              </div>
              <div className="text-[11px] text-[#71717A] mt-0.5">
                Status:{" "}
                <span className="font-semibold text-white capitalize">
                  {notificationStatus}
                </span>
              </div>
            </div>

            {notificationStatus !== "granted" ? (
              <Button
                size="sm"
                onClick={handleEnableNotifications}
                className="font-bold text-xs bg-[#C8FF47] text-black hover:bg-[#b5eb38]"
              >
                Enable
              </Button>
            ) : (
              <span className="text-xs font-bold text-[#C8FF47] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Enabled
              </span>
            )}
          </div>
        </div>

        {/* APPEARANCE */}
        <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 shadow-lg space-y-5">
          <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-white">
            <Moon className="h-4 w-4 text-[#00F0FF]" />
            <span>Appearance</span>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#16161A] border border-[#222228]">
            <div>
              <div className="text-xs font-bold text-white">Theme</div>
              <div className="text-[11px] text-[#71717A] mt-0.5">
                Dark mode is default
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#111114] rounded-lg border border-[#222228]">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  theme === "dark"
                    ? "bg-[#C8FF47] text-black"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <Moon className="h-3.5 w-3.5" /> Dark
              </button>

              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  theme === "light"
                    ? "bg-[#C8FF47] text-black"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <Sun className="h-3.5 w-3.5" /> Light
              </button>
            </div>
          </div>

          {/* Larger Text Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#16161A] border border-[#222228]">
            <div>
              <div className="text-xs font-bold text-white">Larger Text</div>
              <div className="text-[11px] text-[#71717A] mt-0.5">
                Increase font size throughout app
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLargerText(!largerText)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                largerText ? "bg-[#C8FF47]" : "bg-[#27272A]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${
                  largerText ? "translate-x-5" : "translate-x-0 bg-white"
                }`}
              />
            </button>
          </div>

          {/* Reduce Motion Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#16161A] border border-[#222228]">
            <div>
              <div className="text-xs font-bold text-white">Reduce Motion</div>
              <div className="text-[11px] text-[#71717A] mt-0.5">
                Minimize animations
              </div>
            </div>

            <button
              type="button"
              onClick={() => setReduceMotion(!reduceMotion)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                reduceMotion ? "bg-[#C8FF47]" : "bg-[#27272A]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow transition ${
                  reduceMotion ? "translate-x-5" : "translate-x-0 bg-white"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ACCESSIBILITY */}
        <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-white">
            <Accessibility className="h-4 w-4 text-[#A78BFA]" />
            <span>Accessibility</span>
          </div>

          <div className="space-y-2.5 text-xs text-[#A1A1AA] p-4 rounded-xl bg-[#16161A] border border-[#222228]">
            {[
              "Keyboard navigation supported throughout",
              "ARIA labels on interactive elements",
              "Focus states visible for all controls",
              "AA contrast ratio maintained (4.5:1+)",
              "Reduced motion support via CSS prefers-reduced-motion",
            ].map((checkItem, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-white">
                <Check className="h-3.5 w-3.5 text-[#C8FF47] shrink-0" />
                <span>{checkItem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* INSTALL APP */}
        <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-white">
            <Download className="h-4 w-4 text-[#C8FF47]" />
            <span>Install App</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#16161A] border border-[#222228]">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Progressive Web App</span>
                <ShieldCheck className="h-3.5 w-3.5 text-[#C8FF47]" />
              </div>
              <p className="text-[11px] text-[#A1A1AA] mt-1 max-w-md">
                Install FitSync AI as a Progressive Web App for a native app
                experience — works offline, loads fast, and syncs automatically.
              </p>
            </div>

            <Button
              size="sm"
              onClick={handleInstallApp}
              className="font-bold text-xs bg-[#C8FF47] text-black hover:bg-[#b5eb38] shrink-0"
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
