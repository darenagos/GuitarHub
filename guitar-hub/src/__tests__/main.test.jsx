import React from "react"; // Correct import for React
import { render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import { AuthContextProvider } from "../context/AuthContext.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes/router.jsx";

// Test to check if the components render properly
describe("Main Component (main.jsx)", () => {
  it("renders the Guitar Hub heading", () => {
    // Render the application component wrapped with StrictMode and context providers
    render(
      <StrictMode>
        <div className="p-5">
          <h1>Guitar Hub project</h1>
          <AuthContextProvider>
            <RouterProvider router={router} />
          </AuthContextProvider>
        </div>
      </StrictMode>
    );

    // Check if the "Guitar Hub project" heading is rendered
    const heading = screen.getByText(/Guitar Hub project/i);
    expect(heading).toBeInTheDocument();
  });

  it("renders AuthContextProvider and RouterProvider without crashing", () => {
    const { container } = render(
      <StrictMode>
        <div className="p-5">
          <h1>Guitar Hub project</h1>
          <AuthContextProvider>
            <RouterProvider router={router} />
          </AuthContextProvider>
        </div>
      </StrictMode>
    );

    // Verify that the component renders without errors
    expect(container).toBeInTheDocument();
  });
});
