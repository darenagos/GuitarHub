import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SigninPage from "../pages/SigninPage";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "../context/AuthContext";
import "@testing-library/jest-dom";

// Mock the auth context values
vi.mock("../context/AuthContext", () => ({
  AuthContextProvider: ({ children }) => children,
  UserAuth: () => ({
    session: null,
    signIn: vi.fn(),
  }),
}));

describe("SigninPage", () => {
  test("renders signin form with all fields", () => {
    render(
      <BrowserRouter>
        <AuthContextProvider>
          <SigninPage />
        </AuthContextProvider>
      </BrowserRouter>
    );

    // Check if all form elements are present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("allows user to fill out signin form", async () => {
    render(
      <BrowserRouter>
        <AuthContextProvider>
          <SigninPage />
        </AuthContextProvider>
      </BrowserRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Check if inputs have correct values
    expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("password123");
  });

  test("submits form with user credentials", async () => {
    render(
      <BrowserRouter>
        <AuthContextProvider>
          <SigninPage />
        </AuthContextProvider>
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);
  });
});
