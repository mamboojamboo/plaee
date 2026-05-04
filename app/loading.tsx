import { LoadingSkeleton } from "@/src/shared/ui/loading-skeleton";

const HOME_EVENT_GRID_CLASS =
  "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[180px]";

export const HomeLoading = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-col gap-4">
        <nav className="bg-background" aria-hidden>
          <div className="flex flex-col gap-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="h-7 w-36 animate-pulse rounded bg-border/70" />
              <div className="flex shrink-0 items-center gap-0.5">
                <div className="size-10 animate-pulse rounded-[7.2px] bg-border/50" />
                <div className="size-10 animate-pulse rounded-[7.2px] bg-border/50" />
                <div className="size-10 animate-pulse rounded-[7.2px] bg-border/50" />
              </div>
            </div>
            <div className="flex min-h-10 gap-2 overflow-hidden">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-border/40"
                />
              ))}
            </div>
          </div>
        </nav>
        <LoadingSkeleton count={12} className={HOME_EVENT_GRID_CLASS} />
      </div>
    </main>
  );
};

export default HomeLoading;
