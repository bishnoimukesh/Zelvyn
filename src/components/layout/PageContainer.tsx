import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  title,
  description,
  badge,
  action,
}) => {
  return (
    <div className={cn("w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 space-y-6", className)}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#222228] pb-4">
          <div>
            <div className="flex items-center gap-2">
              {title && (
                <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  {title}
                </h1>
              )}
              {badge && (
                <span className="rounded-md border border-[#C8FF47]/30 bg-[#C8FF47]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#C8FF47]">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-xs sm:text-sm text-[#A1A1AA]">
                {description}
              </p>
            )}
          </div>

          {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
};
