import { APP_INTL } from "@/app/constants";

export const NotFound = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          {APP_INTL.NOT_FOUND_TITLE}
        </h1>
        <p className="mt-3 text-base text-foreground-muted">
          {APP_INTL.NOT_FOUND_DESCRIPTION}
        </p>
      </div>
    </main>
  );
};

export default NotFound;
