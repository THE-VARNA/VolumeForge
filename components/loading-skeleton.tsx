import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  variant?: "card" | "row" | "text" | "circle";
}

export function LoadingSkeleton({
  className,
  lines = 3,
  variant = "card",
}: LoadingSkeletonProps) {
  if (variant === "circle") {
    return (
      <div className={cn("rounded-full shimmer bg-white/5", className ?? "w-10 h-10")} />
    );
  }

  if (variant === "text") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded shimmer bg-white/5"
            style={{ width: i === lines - 1 ? "60%" : "100%" }}
          />
        ))}
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className={cn("glass rounded-lg p-4 flex items-center gap-4", className)}>
        <div className="w-8 h-8 rounded-full shimmer bg-white/5 flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 rounded shimmer bg-white/5 w-1/3" />
          <div className="h-3 rounded shimmer bg-white/5 w-2/3" />
        </div>
        <div className="h-6 w-16 rounded shimmer bg-white/5" />
      </div>
    );
  }

  return (
    <div className={cn("glass rounded-xl p-6 flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 rounded shimmer bg-white/5 w-1/4" />
          <div className="h-7 rounded shimmer bg-white/5 w-1/2" />
        </div>
        <div className="w-10 h-10 rounded-lg shimmer bg-white/5" />
      </div>
      <div className="h-1.5 rounded-full shimmer bg-white/5" />
      <div className="h-3 rounded shimmer bg-white/5 w-1/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: rows }).map((_, i) => (
        <LoadingSkeleton key={i} variant="row" />
      ))}
    </div>
  );
}
