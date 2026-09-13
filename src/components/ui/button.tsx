import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#C8FF47] text-[#08080A] font-bold shadow-md hover:bg-[#d8ff6a] hover:shadow-[0_0_20px_rgba(200,255,71,0.3)]",
        destructive:
          "bg-[#EF4444] text-white hover:bg-[#dc2626] shadow-sm",
        outline:
          "border border-[#222228] bg-[#111115] text-[#F2F2F5] hover:border-[#333338] hover:bg-[#1A1A1F]",
        secondary:
          "bg-[#1A1A1F] text-[#F2F2F5] hover:bg-[#222228]",
        ghost:
          "hover:bg-[#1A1A1F] hover:text-[#C8FF47]",
        link: "text-[#C8FF47] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base font-bold",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
