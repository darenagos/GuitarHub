import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SongDetailPage from "../pages/SongDetailPage";
import "@testing-library/jest-dom";
import * as router from "react-router-dom";

// Mock the hooks and components
const mockUseFetchSong = vi.fn();
vi.mock("../hooks/useFetchSong", () => ({
  default: (id) => mockUseFetchSong(id),
}));

const mockUseFetchAudio = vi.fn();
vi.mock("../hooks/useFetchAudio", () => ({
  default: (jamendoId) => mockUseFetchAudio(jamendoId),
}));

// Mock the components
vi.mock("../components/HOC/FadePageWrapper", () => ({
  default: ({ children }) => <div data-testid="fade-wrapper">{children}</div>,
}));

vi.mock(
  "../components/LearningComponents/LearningSongDetailPageComponents/SongDetails",
  () => ({
    default: ({ song, id }) => (
      <div data-testid="song-details">
        <span>Song: {song?.name}</span>
        <span>Artist: {song?.artist}</span>
        <span>ID: {id}</span>
      </div>
    ),
  })
);

vi.mock(
  "../components/LearningComponents/LearningSongDetailPageComponents/AudioPlayer",
  () => ({
    default: ({ audioUrl, onTimeUpdate }) => (
      <div data-testid="audio-player">
        <audio
          src={audioUrl}
          data-testid="audio-element"
          onTimeUpdate={onTimeUpdate}
        />
        <button
          data-testid="simulate-time-update"
          onClick={() => onTimeUpdate({ target: { currentTime: 15.75 } })}
        >
          Simulate Time Update
        </button>
      </div>
    ),
  })
);

vi.mock(
  "../components/LearningComponents/LearningSongDetailPageComponents/ChordDisplaySection",
  () => ({
    default: ({ chordSequence, currentSecond }) => (
      <div data-testid="chord-display">
        <span>Current Second: {currentSecond}</span>
        <span>
          Chords: {chordSequence ? chordSequence.join(", ") : "No chords"}
        </span>
      </div>
    ),
  })
);

// Keep useParams mock
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

describe("SongDetailPage", () => {
  const mockSong = {
    id: "123",
    name: "Test Song",
    artist: "Test Artist",
    jamendo_id: "j456",
    chord_sequence: ["A", "Bm", "C", "D"],
  };

  const mockAudioUrl = "https://test-audio-url.com/song.mp3";

  // Helper function to render with Router context
  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter initialEntries={[`/songs/123`]}>{component}</MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Configure mock return values
    vi.mocked(router.useParams).mockReturnValue({ id: "123" });
    mockUseFetchSong.mockReturnValue({
      song: mockSong,
      loading: false,
      error: null,
    });
    mockUseFetchAudio.mockReturnValue(mockAudioUrl);
  });

  test("renders song details when loaded", () => {
    renderWithRouter(<SongDetailPage />);

    expect(screen.getByTestId("song-details")).toBeInTheDocument();
    expect(screen.getByText("Song: Test Song")).toBeInTheDocument();
    expect(screen.getByText("Artist: Test Artist")).toBeInTheDocument();
  });

  test("renders audio player when audio URL is available", () => {
    renderWithRouter(<SongDetailPage />);

    expect(screen.getByTestId("audio-player")).toBeInTheDocument();
    expect(screen.getByTestId("audio-element")).toHaveAttribute(
      "src",
      mockAudioUrl
    );
  });

  test("renders chord display section with chord sequence", () => {
    renderWithRouter(<SongDetailPage />);

    expect(screen.getByTestId("chord-display")).toBeInTheDocument();
    expect(screen.getByText("Chords: A, Bm, C, D")).toBeInTheDocument();
  });

  test("updates current second when audio time updates", () => {
    renderWithRouter(<SongDetailPage />);

    // Initial value should be 0
    expect(screen.getByText("Current Second: 0")).toBeInTheDocument();

    // Simulate time update event
    fireEvent.click(screen.getByTestId("simulate-time-update"));

    // Current second should now be 15 (floor of 15.75)
    expect(screen.getByText("Current Second: 15")).toBeInTheDocument();
  });

  test("displays loading state when song is loading", () => {
    mockUseFetchSong.mockReturnValueOnce({
      song: null,
      loading: true,
      error: null,
    });

    renderWithRouter(<SongDetailPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error message when song fails to load", () => {
    const errorMessage = "Failed to fetch song";
    mockUseFetchSong.mockReturnValueOnce({
      song: null,
      loading: false,
      error: { message: errorMessage },
    });

    renderWithRouter(<SongDetailPage />);

    expect(
      screen.getByText(`Error loading song: ${errorMessage}`)
    ).toBeInTheDocument();
  });

  test("does not render audio player when no audio URL", () => {
    mockUseFetchAudio.mockReturnValueOnce(null);

    renderWithRouter(<SongDetailPage />);

    expect(screen.queryByTestId("audio-player")).not.toBeInTheDocument();
  });

  test("does not render audio player when no chord sequence", () => {
    mockUseFetchSong.mockReturnValueOnce({
      song: { ...mockSong, chord_sequence: [] },
      loading: false,
      error: null,
    });

    renderWithRouter(<SongDetailPage />);

    expect(screen.queryByTestId("audio-player")).not.toBeInTheDocument();
  });

  test("fetches song with correct ID from URL params", () => {
    const songId = "789";
    vi.mocked(router.useParams).mockReturnValueOnce({ id: songId });

    renderWithRouter(<SongDetailPage />);

    expect(mockUseFetchSong).toHaveBeenCalledWith(songId);
  });

  test("fetches audio with correct jamendo ID", () => {
    const jamendoId = "j999";
    mockUseFetchSong.mockReturnValueOnce({
      song: { ...mockSong, jamendo_id: jamendoId },
      loading: false,
      error: null,
    });

    renderWithRouter(<SongDetailPage />);

    expect(mockUseFetchAudio).toHaveBeenCalledWith(jamendoId);
  });
});
