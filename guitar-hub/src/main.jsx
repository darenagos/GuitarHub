import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./routes/router.jsx";

import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <h1>Guitar Hub project</h1>
    </>
    <RouterProvider router={router} />
  </StrictMode>
);
