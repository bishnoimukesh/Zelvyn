import React, { useRef, useEffect } from "react";
import { Bell, CheckCheck, Dumbbell, Flame, Bot, Info, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setNotificationsOpen,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotification,
  NotificationItem,
} from "@/features/ui/uiSlice";
import { cn } from "@/lib/utils";

interface NotificationPopoverProps {
  className?: string;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.notificationsOpen);
  const notifications = useAppSelector((state) => state.ui.notifications);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        dispatch(setNotificationsOpen(false));
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, dispatch]);

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "workout":
        return <Dumbbell className="h-4 w-4 text-[#C8FF47]" />;
      case "streak":
        return <Flame className="h-4 w-4 text-amber-400" />;
      case "ai":
        return <Bot className="h-4 w-4 text-cyan-400" />;
      default:
        return <Info className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => dispatch(setNotificationsOpen(!isOpen))}
        aria-label="Open notifications"
        aria-expanded={isOpen}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#222228] bg-[#111115] text-[#A1A1AA] transition-all hover:border-[#C8FF47]/40 hover:text-[#C8FF47]",
          isOpen && "border-[#C8FF47]/50 text-[#C8FF47]"
        )}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C8FF47] text-[10px] font-black text-[#08080A] shadow-[0_0_8px_rgba(200,255,71,0.6)]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Popover Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#222228] bg-[#111115]/95 p-3 shadow-2xl backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#222228] pb-2.5 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#C8FF47]/15 px-2 py-0.5 text-[10px] font-bold text-[#C8FF47]">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => dispatch(markAllNotificationsAsRead())}
                className="flex items-center gap-1 text-[11px] font-medium text-[#A1A1AA] hover:text-[#C8FF47] transition-colors"
              >
                <CheckCheck className="h-3 w-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="mt-2 max-h-72 space-y-1.5 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#71717A]">
                No notifications right now
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => dispatch(markNotificationAsRead(notif.id))}
                  className={cn(
                    "group relative flex items-start gap-3 rounded-lg p-2.5 text-left transition-colors cursor-pointer",
                    notif.read
                      ? "bg-transparent hover:bg-[#1A1A1F]"
                      : "bg-[#1A1A1F]/80 border-l-2 border-[#C8FF47] hover:bg-[#1A1A1F]"
                  )}
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#222228]">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-[#71717A] shrink-0 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A1A1AA] line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(clearNotification(notif.id));
                    }}
                    aria-label="Dismiss notification"
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#71717A] hover:text-white transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
