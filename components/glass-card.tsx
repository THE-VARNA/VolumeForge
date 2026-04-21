import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "violet" | "cyan" | "green" | "hover";
  padding?: "none" | "sm" | "md" | "lg";
  glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", padding = "md", glow = false, ...props }, ref) => {
    const variantClass = {
      default: "glass",
      violet: "glass-violet",
      cyan: "glass-cyan",
      green: "glass-green",
      hover: "glass-hover cursor-pointer",
    }[variant];

    const paddingClass = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    }[padding];

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl",
          variantClass,
          paddingClass,
          glow && "glow-violet",
          className,
        )}
        {...props}
      />
    );
  },
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
