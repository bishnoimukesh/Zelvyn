import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#C8FF47]/10 text-[#C8FF47] border-[#C8FF47]/20",
        secondary:
          "border-transparent bg-[#1A1A1F] text-[#F2F2F5]",
        destructive:
          "border-transparent bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
        outline: "text-[#71717A] border-[#222228]",
        success:
          "border-transparent bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
