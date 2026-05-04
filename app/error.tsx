"use client";

import { APP_INTL } from "@/app/constants";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          {APP_INTL.GLOBAL_ERROR_TITLE}
        </h1>
        <p className="mt-3 text-base text-foreground-muted">
          {error.message || APP_INTL.GLOBAL_ERROR_FALLBACK}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-surface-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-card-hover"
        >
          {APP_INTL.GLOBAL_ERROR_RETRY}
        </button>
      </div>
    </main>
  );
};

export default GlobalError;
