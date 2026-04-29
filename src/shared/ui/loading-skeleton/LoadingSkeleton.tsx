import React from "react";

type LoadingSkeletonProps = {
  count?: number;
  className?: string;
};

export function LoadingSkeleton({
  count = 6,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
}: LoadingSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-background rounded-md h-48 animate-pulse border border-border p-4 space-y-3"
        >
          <div className="h-4 bg-border rounded w-3/4" />
          <div className="h-4 bg-border rounded w-1/2" />
          <div className="space-y-2 pt-2">
            <div className="h-2 bg-border rounded w-full" />
            <div className="h-2 bg-border rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
