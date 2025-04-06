import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import UserCustomSongDetailPage from "../pages/UserCustomSongDetailPage";
import "@testing-library/jest-dom";
import { UserAuth } from "../context/AuthContext";
import {
  fetchUserSongById,
  updateCustomSong,
  deleteCustomSong,
} from "../services/songService";
import { findChordsFromJSON } from "../utils/chordUtils";
import * as router from "react-router-dom";

// Setup mockNavigate at the top level
const mockNavigate = vi.fn();

// Mock react-router-dom useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "123" }),
  };
});

// Mock the other dependencies
vi.mock("../context/AuthContext", () => ({
  UserAuth: vi.fn(),
}));

vi.mock("../services/songService", () => ({
  fetchUserSongById: vi.fn(),
  updateCustomSong: vi.fn(),
  deleteCustomSong: vi.fn(),
}));

vi.mock("../utils/chordUtils", () => ({
  findChordsFromJSON: vi.fn(),
}));

vi.mock("../components/HOC/FadePageWrapper", () => ({
  default: ({ children }) => <div data-testid="fade-wrapper">{children}</div>,
}));

vi.mock("../components/MySongsComponents/UserCustomSongHeader", () => ({
  default: ({ songName, onDelete }) => (
    <div data-testid="song-header">
      <h1>{songName}</h1>
      <button onClick={onDelete} data-testid="delete-song-button">
        Delete Song
      </button>
    </div>
  ),
}));

vi.mock("../components/MySongsComponents/UserCustomChordSequence", () => ({
  default: ({ song, chordDiagrams }) => (
    <div data-testid="chord-sequence">
      <h2>Chord Sequence</h2>
      <p>{song.song_name}</p>
      <p>Number of chord diagrams: {chordDiagrams.length}</p>
    </div>
  ),
}));

vi.mock("../components/MySongsComponents/UserCustomSongEditForm", () => ({
  default: ({
    editedSongName,
    setEditedSongName,
    editedChordSequence,
    setEditedChordSequence,
    handleUpdateSong,
    setIsEditing,
  }) => (
    <form data-testid="edit-form" onSubmit={handleUpdateSong}>
      <input
        data-testid="edit-name-input"
        value={editedSongName}
        onChange={(e) => setEditedSongName(e.target.value)}
      />
      <input
        data-testid="edit-chords-input"
        value={editedChordSequence}
        onChange={(e) => setEditedChordSequence(e.target.value)}
      />
      <button type="submit" data-testid="save-button">
        Save
      </button>
      <button
        type="button"
        data-testid="cancel-button"
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </button>
    </form>
  ),
}));

// Mock window.alert
vi.spyOn(window, "alert").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});

describe("UserCustomSongDetailPage", () => {
  const mockSongId = "123";
  const mockUserId = "user456";
  const mockSession = {
    user: {
      id: mockUserId,
      email: "test@example.com",
    },
  };

  const mockSong = {
    id: mockSongId,
    song_name: "Test Song",
    chord_sequence: JSON.stringify(["A", "Bm", "C", "D"]),
  };

  const mockChordDiagrams = [
    {
      chord: "A",
      positions: [
        {
          /* position data */
        },
      ],
    },
    {
      chord: "Bm",
      positions: [
        {
          /* position data */
        },
      ],
    },
    {
      chord: "C",
      positions: [
        {
          /* position data */
        },
      ],
    },
    {
      chord: "D",
      positions: [
        {
          /* position data */
        },
      ],
    },
  ];

  // Helper function to render component with router
  const renderWithRouter = (ui, { route = `/songs/${mockSongId}` } = {}) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/songs/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    UserAuth.mockReturnValue({
      userId: mockUserId,
      session: mockSession,
    });

    fetchUserSongById.mockResolvedValue({
      data: mockSong,
      error: null,
    });

    updateCustomSong.mockResolvedValue({
      error: null,
    });

    deleteCustomSong.mockResolvedValue({
      error: null,
    });

    findChordsFromJSON.mockReturnValue(mockChordDiagrams);
  });

  test("renders loading state initially", () => {
    renderWithRouter(<UserCustomSongDetailPage />);

    // Should find the loading div
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.queryByTestId("song-header")).not.toBeInTheDocument();
  });

  test("fetches and displays song details", async () => {
    renderWithRouter(<UserCustomSongDetailPage />);

    // Verify fetchUserSongById was called with correct params
    expect(fetchUserSongById).toHaveBeenCalledWith(mockUserId, mockSongId);

    // Wait for song to load
    await waitFor(() => {
      expect(screen.getByTestId("song-header")).toBeInTheDocument();
    });

    // Check that song details are displayed
    expect(
      screen.getByRole("heading", { name: "Test Song" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("chord-sequence")).toBeInTheDocument();
  });

  test("handles song not found", async () => {
    fetchUserSongById.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    renderWithRouter(<UserCustomSongDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Song not found")).toBeInTheDocument();
    });
  });

  test("shows edit form when edit button is clicked", async () => {
    renderWithRouter(<UserCustomSongDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Edit Song")).toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByText("Edit Song"));

    // Edit form should appear
    expect(screen.getByTestId("edit-form")).toBeInTheDocument();
    expect(screen.getByTestId("edit-name-input")).toHaveValue("Test Song");
    expect(screen.getByTestId("edit-chords-input")).toHaveValue("A, Bm, C, D");
  });

  test("updates song successfully", async () => {
    renderWithRouter(<UserCustomSongDetailPage />);

    // Wait for song to load
    await waitFor(() => {
      expect(screen.getByText("Edit Song")).toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByText("Edit Song"));

    // Change input values
    fireEvent.change(screen.getByTestId("edit-name-input"), {
      target: { value: "Updated Song Name" },
    });

    fireEvent.change(screen.getByTestId("edit-chords-input"), {
      target: { value: "E, F, G" },
    });

    // Submit the form
    fireEvent.submit(screen.getByTestId("edit-form"));

    // Verify updateCustomSong was called with correct params
    expect(updateCustomSong).toHaveBeenCalledWith(
      mockSongId,
      "Updated Song Name",
      JSON.stringify(["E", "F", "G"])
    );

    // Wait for update to complete
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Song updated successfully.");
    });
  });

  test("handles update error", async () => {
    updateCustomSong.mockResolvedValueOnce({
      error: { message: "Update failed" },
    });

    renderWithRouter(<UserCustomSongDetailPage />);

    // Wait for song to load
    await waitFor(() => {
      expect(screen.getByText("Edit Song")).toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByText("Edit Song"));

    // Submit the form without changing anything
    fireEvent.submit(screen.getByTestId("edit-form"));

    // Should display error alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to update song.");
      expect(console.error).toHaveBeenCalled();
    });
  });

  test("deletes song successfully", async () => {
    renderWithRouter(<UserCustomSongDetailPage />);

    // Wait for song to load
    await waitFor(() => {
      expect(screen.getByTestId("delete-song-button")).toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByTestId("delete-song-button"));

    // Verify deleteCustomSong was called with correct ID
    expect(deleteCustomSong).toHaveBeenCalledWith(mockSongId);

    // Should show success message and navigate
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Song deleted successfully.");
      expect(mockNavigate).toHaveBeenCalledWith("/my-songs");
    });
  });

  test("handles delete error", async () => {
    deleteCustomSong.mockResolvedValueOnce({
      error: { message: "Delete failed" },
    });

    renderWithRouter(<UserCustomSongDetailPage />);

    // Wait for song to load
    await waitFor(() => {
      expect(screen.getByTestId("delete-song-button")).toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByTestId("delete-song-button"));

    // Should display error alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to delete song");
      expect(console.error).toHaveBeenCalled();
    });
  });

  test("handles fetch error", async () => {
    fetchUserSongById.mockResolvedValueOnce({
      data: null,
      error: { message: "Fetch failed" },
    });

    renderWithRouter(<UserCustomSongDetailPage />);

    // Console error should be logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching song:",
        expect.objectContaining({ message: "Fetch failed" })
      );
    });
  });

  test("handles invalid chord sequence format", async () => {
    // Mock a song with invalid chord sequence format
    fetchUserSongById.mockResolvedValueOnce({
      data: {
        ...mockSong,
        chord_sequence: "invalid-json",
      },
      error: null,
    });

    renderWithRouter(<UserCustomSongDetailPage />);

    // Console error should be logged for parse error
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error parsing chord sequence JSON:",
        expect.any(Error)
      );
    });
  });

  test("handles non-array chord sequence", async () => {
    // Mock a song with non-array chord sequence
    fetchUserSongById.mockResolvedValueOnce({
      data: {
        ...mockSong,
        chord_sequence: JSON.stringify({ notAnArray: true }),
      },
      error: null,
    });

    renderWithRouter(<UserCustomSongDetailPage />);

    // Console error should be logged for invalid format
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Invalid chord sequence format"
      );
    });
  });

  test("cancels editing", async () => {
    renderWithRouter(<UserCustomSongDetailPage />);

    // Wait for song to load
    await waitFor(() => {
      expect(screen.getByText("Edit Song")).toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByText("Edit Song"));

    // Edit form should appear
    expect(screen.getByTestId("edit-form")).toBeInTheDocument();

    // Click cancel button
    fireEvent.click(screen.getByTestId("cancel-button"));

    // Edit form should disappear
    await waitFor(() => {
      expect(screen.queryByTestId("edit-form")).not.toBeInTheDocument();
    });
  });
});
