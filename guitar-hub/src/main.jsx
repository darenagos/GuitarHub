import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./routes/router.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <h1>Guitar Hub project</h1>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </>
  </StrictMode>
);
