import { useState } from "react";
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
      if (typeof window !== "undefined") {
        window.location.hash = initialPath;
      }
      return createHashRouter(routes);
    });
    return <RouterProvider router={router} />;
  };
}
