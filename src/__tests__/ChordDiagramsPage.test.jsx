import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChordDiagramsPage from "../pages/ChordDiagramsPage";
import "@testing-library/jest-dom";

// Mock the findChord utility
vi.mock("../utils/chordUtils", () => ({
  findChord: vi.fn(),
}));

// Mock child components
vi.mock("../components/HOC/FadePageWrapper", () => ({
  default: ({ children }) => <div data-testid="fade-wrapper">{children}</div>,
}));

// Create a mock version of ChordDiagramSearchBar that allows testing the search function
let searchBarProps = {};
vi.mock("../components/ChordDiagramComponents/ChordDiagramSearchBar", () => ({
  default: (props) => {
    searchBarProps = props;
    return (
      <div data-testid="chord-search-bar">
        <input
          data-testid="chord-name-input"
          placeholder="Chord name"
          onChange={(e) => {
            searchBarProps.onSearch(e.target.value, "");
          }}
        />
        <button
          data-testid="search-button"
          onClick={() => searchBarProps.onSearch("A", "maj")}
        >
          Search
        </button>
        <button
          data-testid="clear-button"
          onClick={() => searchBarProps.onSearch("", "")}
        >
          Clear
        </button>
      </div>
    );
  },
}));

vi.mock("../components/ChordDiagramComponents/ChordDiagram", () => ({
  default: ({ chordData }) => (
    <div data-testid="chord-diagram">
      <span>
        Chord: {chordData?.key}
        {chordData?.suffix}
      </span>
    </div>
  ),
}));

vi.mock("../components/ChordDiagramComponents/ChordDatabase", () => ({
  default: () => <div data-testid="chord-database">Chord Database</div>,
}));

// Import the findChord function for manipulation in tests
import { findChord } from "../utils/chordUtils";

describe("ChordDiagramsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders initial page with search bar and chord database", () => {
    render(<ChordDiagramsPage />);

    // Verify initial components are rendered
    expect(screen.getByTestId("chord-search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("chord-database")).toBeInTheDocument();

    // Verify initial state - no search results shown
    expect(screen.queryByTestId("chord-diagram")).not.toBeInTheDocument();
    expect(screen.queryByText(/No chords found/i)).not.toBeInTheDocument();
  });

  test("displays chord diagram when search finds results", () => {
    findChord.mockReturnValue([{ key: "A", suffix: "maj", positions: [{}] }]);

    render(<ChordDiagramsPage />);

    // Simulate search button click
    fireEvent.click(screen.getByTestId("search-button"));

    // Verify chord diagram is displayed
    expect(screen.getByTestId("chord-diagram")).toBeInTheDocument();
    expect(screen.getByText(/Chord: Amaj/i)).toBeInTheDocument();
  });

  test("displays no results message when search finds nothing", () => {
    findChord.mockReturnValue([]);

    render(<ChordDiagramsPage />);

    fireEvent.click(screen.getByTestId("search-button"));

    expect(screen.queryByTestId("chord-diagram")).not.toBeInTheDocument();
    expect(
      screen.getByText(/No chords found matching your search criteria/i)
    ).toBeInTheDocument();
  });

  test("clears search results when search is cleared", () => {
    // Setup initial successful search
    findChord.mockReturnValue([{ key: "A", suffix: "maj", positions: [{}] }]);

    render(<ChordDiagramsPage />);

    fireEvent.click(screen.getByTestId("search-button"));

    expect(screen.getByTestId("chord-diagram")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("clear-button"));

    expect(screen.queryByTestId("chord-diagram")).not.toBeInTheDocument();
    expect(screen.queryByText(/No chords found/i)).not.toBeInTheDocument();
  });
});
