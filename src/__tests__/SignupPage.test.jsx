import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SignupPage from "../pages/SignupPage";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "../context/AuthContext";
import "@testing-library/jest-dom";

// Mock the auth context values
vi.mock("../context/AuthContext", () => ({
  AuthContextProvider: ({ children }) => children,
  UserAuth: () => ({
    session: null,
    signUpNewUser: vi.fn(),
  }),
}));

const signUpNewUserMock = vi.fn();

vi.mock("../context/AuthContext", () => ({
  AuthContextProvider: ({ children }) => children,
  UserAuth: () => ({
    session: null,
    signUpNewUser: signUpNewUserMock, // use the external mock
  }),
}));

describe("SignupPage", () => {
  test("renders signup form with all fields", () => {
    render(
      <BrowserRouter>
        <AuthContextProvider>
          <SignupPage />
        </AuthContextProvider>
      </BrowserRouter>
    );

    // Check if all form elements are present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test("allows user to fill out form", async () => {
    render(
      <BrowserRouter>
        <AuthContextProvider>
          <SignupPage />
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

  test("submits signup form and calls signUpNewUser", async () => {
    render(
      <BrowserRouter>
        <AuthContextProvider>
          <SignupPage />
        </AuthContextProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(signUpButton);

    // Now check that the mock was called
    expect(signUpNewUserMock).toHaveBeenCalled(
      "test@example.com",
      "password123"
    );
  });
});
