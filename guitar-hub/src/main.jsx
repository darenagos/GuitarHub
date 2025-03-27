import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./routes/router.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import "./tailwind.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <div className=" bg-[#FAF9F6] h-screen w-full  ">
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </div>
    </>
  </StrictMode>
);
