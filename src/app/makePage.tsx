import { useState } from "react";
import { createHashRouter, RouterProvider } from "react-router";
import { routes } from "./routes";

export function makePage(initialPath: string) {
  return function Page() {
    const [router] = useState(() => {
      // Set the hash to the target path before the router reads window.location
      if (typeof window !== "undefined") {
        window.location.hash = initialPath;
      }
      return createHashRouter(routes);
    });
    return <RouterProvider router={router} />;
  };
}
