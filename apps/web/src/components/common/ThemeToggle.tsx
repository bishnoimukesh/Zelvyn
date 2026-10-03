import React from "react";
import { Sun, Moon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleTheme } from "@/features/ui/uiSlice";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, showLabel = false }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "relative flex items-center gap-2 rounded-lg border border-border bg-card p-2 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-1 focus:ring-primary",
        showLabel && "px-3 py-2 w-full justify-start",
        className
      )}
    >
      <div className="relative h-4 w-4">
        <Sun
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-300",
            theme === "dark" ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0 text-amber-500"
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-300",
            theme === "dark" ? "scale-100 opacity-100 rotate-0 text-primary" : "scale-0 opacity-0 -rotate-90"
          )}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider">
          {theme === "dark" ? "Dark Theme" : "Light Theme"}
        </span>
      )}
    </button>
  );
};
