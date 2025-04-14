import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
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

vi.mock("../components/MySongsComponents/UserCustomSongHeader", () => ({
  default: ({ songName }) => <div data-testid="song-header">{songName}</div>,
}));

vi.mock("../components/MySongsComponents/UserCustomChordSequence", () => ({
  default: () => <div data-testid="chord-sequence">Chord Sequence</div>,
}));

vi.mock("../components/MySongsComponents/UserCustomSongEditForm", () => ({
  default: () => <div data-testid="edit-form">Edit Form</div>,
}));

// Disable console errors to avoid cluttering test output
vi.spyOn(console, "error").mockImplementation(() => {});

describe("UserCustomSongDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up the most basic mocks needed for the component to render
    UserAuth.mockReturnValue({
      userId: "user123",
      session: { user: { id: "user123" } },
    });

    // Mock fetchUserSongById with synchronous implementation
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

  test("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <UserCustomSongDetailPage />
      </MemoryRouter>
    );

    // The component should initially show loading
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });
});
