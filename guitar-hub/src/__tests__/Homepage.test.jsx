import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Homepage from "../pages/Homepage";
import "@testing-library/jest-dom";
import { UserAuth } from "../context/AuthContext";

// Mock the modules that Homepage imports
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Declare mockNavigate at the top level
const mockNavigate = vi.fn();
const mockSignOut = vi.fn();

vi.mock("../context/AuthContext", () => ({
  UserAuth: vi.fn(),
}));

vi.mock("../hooks/useFetchSongs", () => ({
  default: () => ({
    songs: [],
    loading: false,
    error: null,
    fetchSongs: vi.fn(),
  }),
}));

vi.mock("../components/HOC/FadePageWrapper", () => ({
  default: ({ children }) => <div data-testid="fade-wrapper">{children}</div>,
}));

vi.mock("../components/HomepageComponents/RecentSongs", () => ({
  default: () => <div data-testid="recent-songs">Recent Songs Component</div>,
}));

vi.mock("../components/HomepageComponents/notes", () => ({
  default: () => <div data-testid="notes">Notes Component</div>,
}));

describe("Homepage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Configure mocks for each test
    mockSignOut.mockResolvedValue(undefined);

    UserAuth.mockReturnValue({
      session: { user: { id: "test-user-id", email: "test@example.com" } },
      signOut: mockSignOut,
    });
  });

  test("renders welcome message with user email", () => {
    render(<Homepage />);
    expect(screen.getByText(/Welcome, test@example.com/)).toBeInTheDocument();
  });

  test("renders sign out button", () => {
    render(<Homepage />);
    expect(
      screen.getByRole("button", { name: /sign out/i })
    ).toBeInTheDocument();
  });

  test("renders RecentSongs component", () => {
    render(<Homepage />);
    expect(screen.getByTestId("recent-songs")).toBeInTheDocument();
  });

  test("renders Notes component", () => {
    render(<Homepage />);
    expect(screen.getByTestId("notes")).toBeInTheDocument();
  });

  test("calls signOut and navigates when sign out button is clicked", async () => {
    render(<Homepage />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalled();

    // Wait for the async function to complete
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("handles error during sign out", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSignOut.mockRejectedValueOnce(new Error("Sign out failed"));

    render(<Homepage />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(signOutButton);

    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
