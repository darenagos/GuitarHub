import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserCustomSongDetailPage from "../pages/UserCustomSongDetailPage";
import "@testing-library/jest-dom";
import { UserAuth } from "../context/AuthContext";
import {
  fetchUserSongById,
  updateCustomSong,
  deleteCustomSong,
} from "../services/songService";
import { findChordsFromJSON } from "../utils/chordUtils";

// Mock all external dependencies to prevent any async behavior
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "123" }),
  };
});

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

// Create props capture for the header component to test delete functionality
let headerProps = {};
vi.mock("../components/MySongsComponents/UserCustomSongHeader", () => ({
  default: (props) => {
    headerProps = props;
    return (
      <div data-testid="song-header">
        {props.songName}
        <button data-testid="delete-button" onClick={props.onDelete}>
          Delete
        </button>
      </div>
    );
  },
}));

vi.mock("../components/MySongsComponents/UserCustomChordSequence", () => ({
  default: () => <div data-testid="chord-sequence">Chord Sequence</div>,
}));

// Create props capture for the edit form to test edit functionality
let editFormProps = {};
vi.mock("../components/MySongsComponents/UserCustomSongEditForm", () => ({
  default: (props) => {
    editFormProps = props;
    return (
      <div data-testid="edit-form">
        <input
          data-testid="song-name-input"
          value={props.editedSongName}
          onChange={(e) => props.setEditedSongName(e.target.value)}
        />
        <input
          data-testid="chord-sequence-input"
          value={props.editedChordSequence}
          onChange={(e) => props.setEditedChordSequence(e.target.value)}
        />
        <button data-testid="save-button" onClick={props.handleUpdateSong}>
          Save
        </button>
        <button
          data-testid="cancel-button"
          onClick={() => props.setIsEditing(false)}
        >
          Cancel
        </button>
      </div>
    );
  },
}));

describe("UserCustomSongDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    UserAuth.mockReturnValue({
      userId: "user123",
      session: { user: { id: "user123" } },
    });

    fetchUserSongById.mockReturnValue({
      data: {
        id: "123",
        song_name: "Test Song",
        chord_sequence: JSON.stringify(["A", "B", "C"]),
      },
      error: null,
    });

    findChordsFromJSON.mockReturnValue([{ chord: "A", positions: [{}] }]);
  });

  test("shows edit form when Edit Song button is clicked", async () => {
    render(
      <MemoryRouter>
        <UserCustomSongDetailPage />
      </MemoryRouter>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    // Find and click the edit button
    fireEvent.click(screen.getByText(/Edit Song/i));

    // Verify edit form is displayed
    expect(screen.getByTestId("edit-form")).toBeInTheDocument();
  });

  test("updates song when edit form is submitted", async () => {
    // Set up successful update response
    updateCustomSong.mockResolvedValue({ error: null });

    render(
      <MemoryRouter>
        <UserCustomSongDetailPage />
      </MemoryRouter>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    // Click edit button to show the form
    fireEvent.click(screen.getByText(/Edit Song/i));

    const songNameInput = screen.getByTestId("song-name-input");
    const chordSequenceInput = screen.getByTestId("chord-sequence-input");

    // Change the input values
    fireEvent.change(songNameInput, { target: { value: "Updated Song Name" } });
    fireEvent.change(chordSequenceInput, { target: { value: "D, E, F" } });

    // Submit the form
    fireEvent.click(screen.getByTestId("save-button"));

    // Verify the service was called with correct parameters
    expect(updateCustomSong).toHaveBeenCalledWith(
      "123",
      "Updated Song Name",
      JSON.stringify(["D", "E", "F"])
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Song updated successfully/i)
      ).toBeInTheDocument();
    });
  });

  test("deletes song when delete button is clicked", async () => {
    // Set up successful delete response
    deleteCustomSong.mockResolvedValue({ error: null });

    render(
      <MemoryRouter>
        <UserCustomSongDetailPage />
      </MemoryRouter>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByTestId("delete-button"));

    // Verify service function was called with correct ID
    expect(deleteCustomSong).toHaveBeenCalledWith("123");

    // Check success message appears
    await waitFor(() => {
      expect(
        screen.getByText(/Song deleted successfully/i)
      ).toBeInTheDocument();
    });

    // Verify navigation occurs after delay
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/my-songs");
      },
      { timeout: 1500 }
    );
  });
});
