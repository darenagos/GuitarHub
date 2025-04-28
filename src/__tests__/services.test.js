import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  addSongToLearn,
  fetchUserSongs,
  fetchUserSongById,
  deleteSong,
  addCustomSong,
  deleteCustomSong,
  updateCustomSong,
  updateStatus,
  fetchTopThreeMostRecentSongs,
  fetchTopThreeMostRecentChordProgressions,
  fetchLearningSongs,
  fetchNote,
  addDefaultNote,
  updateNote,
} from "../services/songService";

const mockSupabaseFrom = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
  limit: vi.fn(),
  single: vi.fn(),
};

vi.mock("../supabaseClient", () => {
  return {
    supabase: {
      from: vi.fn(() => mockSupabaseFrom),
    },
  };
});

// Mock fetch API
global.fetch = vi.fn();

describe("Song Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Reset all mock methods to maintain chaining
    mockSupabaseFrom.select.mockReturnValue(mockSupabaseFrom);
    mockSupabaseFrom.insert.mockReturnValue(mockSupabaseFrom);
    mockSupabaseFrom.update.mockReturnValue(mockSupabaseFrom);
    mockSupabaseFrom.delete.mockReturnValue(mockSupabaseFrom);
    mockSupabaseFrom.eq.mockReturnValue(mockSupabaseFrom);
    mockSupabaseFrom.order.mockReturnValue(mockSupabaseFrom);
    mockSupabaseFrom.limit.mockReturnValue(mockSupabaseFrom);
  });

  describe("addSongToLearn", () => {
    test("should add a song successfully", async () => {
      // Mock successful Jamendo API response
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              results: [
                {
                  id: "12345",
                  name: "Test Song",
                  artist_name: "Test Artist",
                },
              ],
            }),
        })
      );

      // Mock successful chord API response
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              chords: {
                chordSequence: ["A", "C", "G"],
              },
            }),
        })
      );

      // Mock Supabase response
      mockSupabaseFrom.single.mockResolvedValueOnce({
        data: { id: 1, name: "Test Song", artist: "Test Artist" },
        error: null,
      });

      const result = await addSongToLearn(
        "Test Song",
        "Test Artist",
        "learning",
        "user123"
      );

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch.mock.calls[0][0]).toContain("api.jamendo.com");
      expect(fetch.mock.calls[1][0]).toContain(
        "audio-analysis.eecs.qmul.ac.uk"
      );

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("songs");
      expect(mockSupabaseFrom.insert).toHaveBeenCalledWith([
        {
          name: "Test Song",
          artist: "Test Artist",
          jamendo_id: "12345",
          chord_sequence: ["A", "C", "G"],
          status: "learning",
          user_id: "user123",
        },
      ]);
      expect(result).toEqual({
        id: 1,
        name: "Test Song",
        artist: "Test Artist",
      });
    });
  });

  describe("fetchUserSongs", () => {
    test("should fetch user songs successfully", async () => {
      const mockSongs = [
        { id: 1, song_name: "Song 1", chord_sequence: '["A","B","C"]' },
        { id: 2, song_name: "Song 2", chord_sequence: '["D","E","F"]' },
      ];

      mockSupabaseFrom.order.mockResolvedValueOnce({
        data: mockSongs,
        error: null,
      });

      const result = await fetchUserSongs("user123");

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("usersChordProgressions");
      expect(mockSupabaseFrom.select).toHaveBeenCalledWith("*");
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("user_id", "user123");
      expect(mockSupabaseFrom.order).toHaveBeenCalledWith("created_at", {
        ascending: true,
      });
      expect(result).toEqual({ data: mockSongs, error: null });
    });
  });

  describe("fetchUserSongById", () => {
    test("should fetch a song by ID successfully", async () => {
      const mockSong = {
        id: 1,
        song_name: "Song 1",
        chord_sequence: '["A","B","C"]',
      };

      mockSupabaseFrom.single.mockResolvedValueOnce({
        data: mockSong,
        error: null,
      });

      const result = await fetchUserSongById("user123", 1);

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("usersChordProgressions");
      expect(mockSupabaseFrom.select).toHaveBeenCalledWith("*");
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("user_id", "user123");
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("id", 1);
      expect(result).toEqual({ data: mockSong });
    });
  });

  describe("deleteSong", () => {
    test("should delete a song successfully", async () => {
      mockSupabaseFrom.eq.mockResolvedValueOnce({
        error: null,
      });

      const result = await deleteSong(1);

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("songs");
      expect(mockSupabaseFrom.delete).toHaveBeenCalled();
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("id", 1);
      expect(result).toEqual({ error: null });
    });
  });

  describe("addCustomSong", () => {
    test("should add a custom song successfully", async () => {
      const mockSong = {
        id: 1,
        song_name: "Custom Song",
        chord_sequence: '["A","B","C"]',
      };

      mockSupabaseFrom.single.mockResolvedValueOnce({
        data: mockSong,
        error: null,
      });

      const result = await addCustomSong("user123", "Custom Song", "A, B, C");

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("usersChordProgressions");
      expect(mockSupabaseFrom.insert).toHaveBeenCalledWith([
        {
          user_id: "user123",
          song_name: "Custom Song",
          chord_sequence: JSON.stringify(["A", "B", "C"]),
        },
      ]);
      expect(result).toEqual({ data: mockSong, error: null });
    });
  });

  describe("deleteCustomSong", () => {
    test("should delete a custom song successfully", async () => {
      mockSupabaseFrom.eq.mockResolvedValueOnce({
        error: null,
      });

      const result = await deleteCustomSong(1);

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("usersChordProgressions");
      expect(mockSupabaseFrom.delete).toHaveBeenCalled();
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("id", 1);
      expect(result).toEqual({ error: null });
    });
  });

  describe("updateCustomSong", () => {
    test("should update a custom song successfully", async () => {
      mockSupabaseFrom.eq.mockResolvedValueOnce({
        error: null,
      });

      // Use a JSON string for chord_sequence as that's what component passes
      const jsonChordSequence = JSON.stringify(["D", "E", "F"]);
      const result = await updateCustomSong(
        1,
        "Updated Song",
        jsonChordSequence
      );

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("usersChordProgressions");
      expect(mockSupabaseFrom.update).toHaveBeenCalledWith({
        song_name: "Updated Song",
        chord_sequence: jsonChordSequence,
      });
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("id", 1);
      expect(result).toEqual({ error: null });
    });
  });
  describe("updateStatus", () => {
    test("should update song status successfully", async () => {
      mockSupabaseFrom.eq.mockResolvedValueOnce({
        error: null,
      });

      const result = await updateStatus(1, "mastered");

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("songs");
      expect(mockSupabaseFrom.update).toHaveBeenCalledWith({
        status: "mastered",
      });
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("id", 1);
      expect(result).toEqual({ error: null, newStatus: "mastered" });
    });
  });

  describe("fetchTopThreeMostRecentSongs", () => {
    test("should fetch recent songs successfully", async () => {
      const mockSongs = [
        { id: 3, name: "Recent Song 1" },
        { id: 2, name: "Recent Song 2" },
        { id: 1, name: "Recent Song 3" },
      ];

      mockSupabaseFrom.limit.mockResolvedValueOnce({
        data: mockSongs,
        error: null,
      });

      const result = await fetchTopThreeMostRecentSongs("user123");

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("songs");
      expect(mockSupabaseFrom.select).toHaveBeenCalledWith("*");
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("user_id", "user123");
      expect(mockSupabaseFrom.order).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
      expect(mockSupabaseFrom.limit).toHaveBeenCalledWith(3);
      expect(result).toEqual({ data: mockSongs, error: null });
    });
  });

  describe("fetchTopThreeMostRecentChordProgressions", () => {
    test("should fetch recent chord progressions successfully", async () => {
      const mockProgressions = [
        { id: 3, song_name: "Recent Progression 1" },
        { id: 2, song_name: "Recent Progression 2" },
        { id: 1, song_name: "Recent Progression 3" },
      ];

      mockSupabaseFrom.limit.mockResolvedValueOnce({
        data: mockProgressions,
        error: null,
      });

      const result = await fetchTopThreeMostRecentChordProgressions("user123");

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("usersChordProgressions");
      expect(mockSupabaseFrom.select).toHaveBeenCalledWith("*");
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("user_id", "user123");
      expect(mockSupabaseFrom.order).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
      expect(mockSupabaseFrom.limit).toHaveBeenCalledWith(3);
      expect(result).toEqual({ data: mockProgressions, error: null });
    });
  });

  describe("fetchLearningSongs", () => {
    test("should fetch learning songs successfully", async () => {
      const mockSongs = [
        { id: 1, name: "Song 1", status: "learning" },
        { id: 2, name: "Song 2", status: "learning" },
      ];

      // Make the LAST method in the chain return the result
      mockSupabaseFrom.eq.mockResolvedValueOnce({
        data: mockSongs,
        error: null,
      });

      const result = await fetchLearningSongs("user123");

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("songs");
      expect(mockSupabaseFrom.select).toHaveBeenCalledWith("*");
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("user_id", "user123");
      expect(result).toEqual({ data: mockSongs, error: null });
    });
  });

  describe("fetchNote", () => {
    test("should fetch user note successfully", async () => {
      const mockNote = {
        id: 1,
        user_id: "user123",
        notes: "This is a test note",
      };

      mockSupabaseFrom.single.mockResolvedValueOnce({
        data: mockNote,
        error: null,
      });

      const result = await fetchNote("user123");

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("userNotes");
      expect(mockSupabaseFrom.select).toHaveBeenCalledWith("*");
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("user_id", "user123");
      expect(mockSupabaseFrom.single).toHaveBeenCalled();
      expect(result).toEqual({ data: mockNote, error: null });
    });
  });

  describe("addDefaultNote", () => {
    test("should add default note successfully", async () => {
      const mockNewNote = {
        id: 1,
        user_id: "user123",
        notes: "Your note here...",
      };

      mockSupabaseFrom.single.mockResolvedValueOnce({
        data: mockNewNote,
        error: null,
      });

      const result = await addDefaultNote("user123");

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("userNotes");
      expect(mockSupabaseFrom.insert).toHaveBeenCalledWith([
        { user_id: "user123", notes: "Your note here..." },
      ]);
      expect(mockSupabaseFrom.select).toHaveBeenCalled();
      expect(mockSupabaseFrom.single).toHaveBeenCalled();
      expect(result).toEqual({ data: mockNewNote, error: null });
    });
  });

  describe("updateNote", () => {
    test("should update note successfully", async () => {
      mockSupabaseFrom.eq.mockResolvedValueOnce({
        error: null,
      });

      const result = await updateNote(1, "Updated note content");

      const { supabase } = await import("../supabaseClient");
      expect(supabase.from).toHaveBeenCalledWith("userNotes");
      expect(mockSupabaseFrom.update).toHaveBeenCalledWith({
        notes: "Updated note content",
      });
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith("id", 1);
      expect(result).toEqual({ error: null });
    });
  });
});
