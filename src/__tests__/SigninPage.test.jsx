import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SigninPage from "../pages/SigninPage";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "../context/AuthContext";
import "@testing-library/jest-dom";

// Declare the mock function
const signInMock = vi.fn();

// Mock the auth context values
vi.mock("../context/AuthContext", () => ({
  AuthContextProvider: ({ children }) => children,
  UserAuth: () => ({
    session: null,
    signInUser: signInMock, // use the external mock
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

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

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

    //Simulate user input
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Submit Form
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);

    // Verify authentication function was called with correct credentials.
    expect(signInMock).toHaveBeenCalledWith("test@example.com", "password123");
  });
});
