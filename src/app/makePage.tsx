import { Suspense, useState } from "react";
import { createHashRouter, RouterProvider } from "react-router";
import { routes } from "./routes";

// Force a full page reload when routes change during development
// so the router is always recreated with the latest route tree.
if (import.meta.hot) {
  import.meta.hot.accept("./routes", () => {
    window.location.reload();
  });
}

export function makePage(initialPath: string) {
  return function Page() {
    const [router] = useState(() => {
      if (typeof window !== "undefined" && !window.location.hash) {
        window.location.hash = initialPath;
      }
      return createHashRouter(routes);
    });
    return <Suspense fallback={<div role="status" aria-live="polite" className="flex min-h-dvh items-center justify-center gap-3 bg-background px-4 text-sm text-muted-foreground"><span className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />Ачаалж байна…</div>}><RouterProvider router={router} /></Suspense>;
  };
}
