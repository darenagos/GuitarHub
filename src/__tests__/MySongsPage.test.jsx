import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MySongsPage from "../pages/MySongsPage";
import "@testing-library/jest-dom";
import { UserAuth } from "../context/AuthContext";
import { fetchUserSongs } from "../services/songService";

// Mock dependencies
vi.mock("../context/AuthContext", () => ({
  UserAuth: vi.fn(),
}));

vi.mock("../services/songService", () => ({
  fetchUserSongs: vi.fn(),
}));

vi.mock("../components/HOC/FadePageWrapper", () => ({
  default: ({ children }) => <div data-testid="fade-wrapper">{children}</div>,
}));

// Mock AddCustomSongForm with prop capture to test refresh function
let addFormProps = {};
vi.mock("../components/MySongsComponents/AddCustomSongForm", () => ({
  default: (props) => {
    addFormProps = props;
    return (
      <div data-testid="add-custom-song-form">
        <button data-testid="refresh-button" onClick={props.fetchUserSongs}>
          Refresh Songs
        </button>
        <span>User ID: {props.userId}</span>
      </div>
    );
  },
}));

vi.mock("../components/MySongsComponents/UserCustomSongList", () => ({
  default: ({ userSongs }) => (
    <div data-testid="user-custom-song-list">
      {userSongs.map((song) => (
        <div key={song.id} data-testid="song-item">
          {song.song_name}
        </div>
      ))}
    </div>
  ),
}));

describe("MySongsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    UserAuth.mockReturnValue({
      session: { user: { id: "test-user-id" } },
    });

    fetchUserSongs.mockResolvedValue({
      data: [
        { id: 1, song_name: "Test Song 1" },
        { id: 2, song_name: "Test Song 2" },
      ],
      error: null,
    });
  });

  test("renders page title", () => {
    render(<MySongsPage />);
    expect(screen.getByText("My Songs")).toBeInTheDocument();
  });

  test("displays loading state initially", () => {
    render(<MySongsPage />);
    // While loading, the song list shouldn't be visible
    expect(
      screen.queryByTestId("user-custom-song-list")
    ).not.toBeInTheDocument();
  });

  test("fetches and displays user songs after loading", async () => {
    render(<MySongsPage />);

    await waitFor(() => {
      expect(fetchUserSongs).toHaveBeenCalledWith("test-user-id");
      expect(screen.getByTestId("user-custom-song-list")).toBeInTheDocument();
      expect(screen.getAllByTestId("song-item")).toHaveLength(2);
      expect(screen.getByText("Test Song 1")).toBeInTheDocument();
      expect(screen.getByText("Test Song 2")).toBeInTheDocument();
    });
  });

  test("refreshes songs when the fetchUserSongs callback is called", async () => {
    render(<MySongsPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("user-custom-song-list")).toBeInTheDocument();
    });

    // Reset the mock to track new calls
    fetchUserSongs.mockClear();

    // Setup new mock data for the refresh
    fetchUserSongs.mockResolvedValueOnce({
      data: [{ id: 3, song_name: "New Song" }],
      error: null,
    });

    // Trigger the refresh
    fireEvent.click(screen.getByTestId("refresh-button"));

    await waitFor(() => {
      expect(fetchUserSongs).toHaveBeenCalledWith("test-user-id");
      expect(screen.getByText("New Song")).toBeInTheDocument();
    });
  });

  test("passes correct userId to AddCustomSongForm", () => {
    render(<MySongsPage />);
    expect(addFormProps.userId).toBe("test-user-id");
  });
});
