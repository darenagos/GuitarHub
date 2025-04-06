import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LearningPage from "../pages/LearningPage";
import "@testing-library/jest-dom";
import { UserAuth } from "../context/AuthContext";
import { addSongToLearn } from "../services/songService";

// Mock the modules and services
vi.mock("../services/songService", () => ({
  addSongToLearn: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  UserAuth: vi.fn(),
}));

// Fix this mock - create a mock function that returns the desired values
const mockUseFetchSongs = vi.fn();
vi.mock("../hooks/useFetchSongs", () => ({
  default: () => mockUseFetchSongs(),
}));

vi.mock("../components/HOC/FadePageWrapper", () => ({
  default: ({ children }) => <div data-testid="fade-wrapper">{children}</div>,
}));

vi.mock("../components/LearningComponents/SongForm", () => ({
  default: (props) => (
    <div data-testid="song-form">
      <button
        onClick={props.addSongToWantToLearn}
        data-testid="add-song-button"
      >
        Add Song
      </button>
      <input
        data-testid="song-input"
        value={props.songToLearn}
        onChange={(e) => props.setSongToLearn(e.target.value)}
      />
      <input
        data-testid="artist-input"
        value={props.artistOfSongToLearn}
        onChange={(e) => props.setArtistOfSongToLearn(e.target.value)}
      />
      <select
        data-testid="status-select"
        value={props.status}
        onChange={(e) => props.setStatus(e.target.value)}
      >
        <option value="want_to_learn">Want to Learn</option>
        <option value="learning">Learning</option>
        <option value="learned">Learned</option>
      </select>
    </div>
  ),
}));

vi.mock("../components/LearningComponents/SongList", () => ({
  default: ({ wantToLearnList }) => (
    <div data-testid="song-list">
      {wantToLearnList?.map((song) => (
        <div key={song.id} data-testid={`song-${song.id}`}>
          {song.name} - {song.artist}
        </div>
      ))}
    </div>
  ),
}));

// Mock window.alert
vi.spyOn(window, "alert").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});

describe("LearningPage", () => {
  const mockFetchSongs = vi.fn();
  const mockSession = {
    user: {
      id: "user123",
      email: "test@example.com",
    },
  };

  const mockSongs = [
    { id: 1, name: "Test Song 1", artist: "Artist 1" },
    { id: 2, name: "Test Song 2", artist: "Artist 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup the mocks
    UserAuth.mockReturnValue({
      session: mockSession,
    });

    // Setup useFetchSongs mock - this was causing the error
    mockUseFetchSongs.mockReturnValue({
      songs: mockSongs,
      loading: false,
      error: null,
      fetchSongs: mockFetchSongs,
    });
  });

  test("renders LearningPage with correct header", () => {
    render(<LearningPage />);
    expect(screen.getByText("My Learning")).toBeInTheDocument();
  });

  test("renders SongForm component", () => {
    render(<LearningPage />);
    expect(screen.getByTestId("song-form")).toBeInTheDocument();
  });

  test("renders SongList component with songs", () => {
    render(<LearningPage />);
    expect(screen.getByTestId("song-list")).toBeInTheDocument();
    expect(screen.getByTestId("song-1")).toBeInTheDocument();
    expect(screen.getByTestId("song-2")).toBeInTheDocument();
  });

  test("adds a song successfully", async () => {
    // Setup mocks for successful song addition
    addSongToLearn.mockResolvedValueOnce({
      id: 3,
      name: "New Song",
      artist: "New Artist",
    });

    render(<LearningPage />);

    // Enter song details
    fireEvent.change(screen.getByTestId("song-input"), {
      target: { value: "New Song" },
    });

    fireEvent.change(screen.getByTestId("artist-input"), {
      target: { value: "New Artist" },
    });

    // Submit the form
    fireEvent.click(screen.getByTestId("add-song-button"));

    await waitFor(() => {
      // Verify addSongToLearn was called with correct params
      expect(addSongToLearn).toHaveBeenCalledWith(
        "New Song",
        "New Artist",
        "want_to_learn",
        "user123"
      );

      // Verify fetchSongs was called to refresh the list
      expect(mockFetchSongs).toHaveBeenCalled();

      // Verify success alert was shown
      expect(window.alert).toHaveBeenCalledWith("Song added successfully!");

      // Verify form fields were reset
      expect(screen.getByTestId("song-input").value).toBe("");
      expect(screen.getByTestId("artist-input").value).toBe("");
    });
  });

  test("handles error when adding a song", async () => {
    // Setup mock for failed song addition
    const errorMessage = "Failed to add song";
    addSongToLearn.mockRejectedValueOnce(new Error(errorMessage));

    render(<LearningPage />);

    // Enter song details
    fireEvent.change(screen.getByTestId("song-input"), {
      target: { value: "Problem Song" },
    });

    fireEvent.change(screen.getByTestId("artist-input"), {
      target: { value: "Problem Artist" },
    });

    // Submit the form
    fireEvent.click(screen.getByTestId("add-song-button"));

    await waitFor(() => {
      // Verify error alert was shown
      expect(window.alert).toHaveBeenCalledWith(
        `Error adding song: ${errorMessage}`
      );

      // Verify fetchSongs was not called
      expect(mockFetchSongs).not.toHaveBeenCalled();
    });
  });

  test("handles missing user ID", async () => {
    // Setup mock for missing user session
    UserAuth.mockReturnValueOnce({
      session: null,
    });

    render(<LearningPage />);

    fireEvent.click(screen.getByTestId("add-song-button"));

    await waitFor(() => {
      // Verify console error was logged
      expect(console.error).toHaveBeenCalledWith("User ID not found!");

      // Verify addSongToLearn was not called
      expect(addSongToLearn).not.toHaveBeenCalled();
    });
  });

  test("changes status correctly", () => {
    render(<LearningPage />);

    fireEvent.change(screen.getByTestId("status-select"), {
      target: { value: "learning" },
    });

    // Submit with new status
    fireEvent.click(screen.getByTestId("add-song-button"));

    expect(addSongToLearn).toHaveBeenCalledWith("", "", "learning", "user123");
  });
});
