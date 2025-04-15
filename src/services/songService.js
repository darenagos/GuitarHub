const API_KEY = "05955013";
import { supabase } from "../supabaseClient";

// ==========================
// Song Management Operations
// ==========================

/**
 * Adds a song to the user's learning list, fetching song details from Jamendo API and saving to Supabase.
 * @param {string} songToLearn - Name of the song to learn.
 * @param {string} artistOfSongToLearn - Artist of the song.
 * @param {string} status - Status of the song.
 * @param {string} userId - ID of the user.
 * @returns {object} - Data of the added song or error message.
 */

export const addSongToLearn = async (
  songToLearn,
  artistOfSongToLearn,
  status,
  userId
) => {
  const searchUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${API_KEY}&format=json&limit=1&name=${encodeURIComponent(
    songToLearn
  )}&artist_name=${encodeURIComponent(artistOfSongToLearn)}`;

  try {
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results.length === 0) {
      console.log("No song found on Jamendo");
      return;
    }

    const songResult = searchData.results[0];
    const jamendoId = songResult.id;
    const chordApiUrl = `https://audio-analysis.eecs.qmul.ac.uk/function/analysis/audiocommons/jamendo-tracks:${jamendoId}?descriptors=chords`;
    const chordResponse = await fetch(chordApiUrl);
    const chordData = await chordResponse.json();
    const chordSequence = chordData.chords.chordSequence;

    const newSong = {
      name: songToLearn,
      artist: artistOfSongToLearn,
      jamendo_id: jamendoId,
      chord_sequence: chordSequence,
      status,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from("songs")
      .insert([newSong])
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error adding song:", error);
    throw error;
  }
};

/**
 * Fetches all songs for a specific user.
 * @param {string} userId - ID of the user.
 * @returns {object} - User's songs or error message.
 */

export const fetchUserSongs = async (userId) => {
  if (!userId) return { error: "User not authenticated" };
  const { data, error } = await supabase
    .from("usersChordProgressions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return { data, error };
};

/**
 * Fetches a song by its ID for a specific user.
 * @param {string} userId - ID of the user.
 * @param {string} songId - ID of the song.
 * @returns {object} - Song details or error message.
 */

export const fetchUserSongById = async (userId, songId) => {
  if (!userId) return { error: "User not authenticated" };

  const { data, error } = await supabase
    .from("usersChordProgressions")
    .select("*")
    .eq("user_id", userId)
    .eq("id", songId)
    .single();

  if (error) {
    console.error("Error fetching song by ID:", error);
    return { error: error.message };
  }

  return { data };
};

/**
 * Deletes a song by ID from the database.
 * @param {string} id - ID of the song to delete.
 * @returns {object} - Error message if any.
 */

export const deleteSong = async (id) => {
  const { error } = await supabase.from("songs").delete().eq("id", id);

  return { error };
};

/**
 * Adds a custom song with chord sequence for the user.
 * @param {string} userId - ID of the user.
 * @param {string} songName - Name of the custom song.
 * @param {string} chordSequence - Chord sequence for the song.
 * @returns {object} - Data of the added custom song or error message.
 */

export const addCustomSong = async (userId, songName, chordSequence) => {
  if (!userId) return { error: "User not authenticated" };
  const chordArray = chordSequence.split(",").map((chord) => chord.trim());
  const { data, error } = await supabase
    .from("usersChordProgressions")
    .insert([
      {
        user_id: userId,
        song_name: songName,
        chord_sequence: JSON.stringify(chordArray),
      },
    ])
    .single();
  return { data, error };
};

/**
 * Deletes a custom song by ID.
 * @param {string} id - ID of the custom song to delete.
 * @returns {object} - Error message if any.
 */

export const deleteCustomSong = async (id) => {
  const { error } = await supabase
    .from("usersChordProgressions")
    .delete()
    .eq("id", id);
  return { error };
};

/**
 * Updates a custom song's details.
 * @param {string} id - ID of the song to update.
 * @param {string} songName - New song name.
 * @param {string} chordSequence - New chord sequence.
 * @returns {object} - Error message if any.
 */

export const updateCustomSong = async (id, songName, chordSequence) => {
  const { error } = await supabase
    .from("usersChordProgressions")
    .update({
      song_name: songName,
      chord_sequence: chordSequence,
    })
    .eq("id", id);
  return { error };
};

/**
 * Updates the status of a song.
 * @param {string} id - ID of the song to update.
 * @param {string} newStatus - New status for the song.
 * @returns {object} - Error message if any and the new status.
 */

export const updateStatus = async (id, newStatus) => {
  const { error } = await supabase
    .from("songs")
    .update({ status: newStatus })
    .eq("id", id);

  return { error, newStatus };
};

// ================================
// Fetching Recent and Learning Songs
// ================================

/**
 * Fetches the top 3 most recent songs for a user.
 * @param {string} userId - ID of the user.
 * @returns {object} - The top 3 most recent songs or error message.
 */

export const fetchTopThreeMostRecentSongs = async (userId) => {
  if (!userId) return { error: "User not authenticated" };

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);

  return { data, error };
};

/**
 * Fetches the top 3 most recent custom chord progressions for a user.
 * @param {string} userId - ID of the user.
 * @returns {object} - The top 3 most recent custom chord progressions or error message.
 */

export const fetchTopThreeMostRecentChordProgressions = async (userId) => {
  if (!userId) return { error: "User not authenticated" };

  const { data, error } = await supabase
    .from("usersChordProgressions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);

  return { data, error };
};

/**
 * Fetches all songs for a user that are in the learning process.
 * @param {string} userId - ID of the user.
 * @returns {object} - Learning songs data or error message.
 */

export const fetchLearningSongs = async (userId) => {
  if (!userId) return { error: "User not authenticated" };

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
};

// =========================
// Notes Database Operations
// =========================

/**
 * Fetches notes for a specific user.
 * @param {string} userId - ID of the user.
 * @returns {object} - The user's notes or error message.
 */

export const fetchNote = async (userId) => {
  if (!userId) return { error: "User not authenticated" };
  const { data, error } = await supabase
    .from("userNotes")
    .select("*")
    .eq("user_id", userId)
    .single();

  return { data, error };
};

/**
 * Adds a default note for a new user.
 * @param {string} userId - ID of the user.
 * @returns {object} - The newly created note or error message.
 */

export const addDefaultNote = async (userId) => {
  const { data, error } = await supabase
    .from("userNotes")
    .insert([{ user_id: userId, notes: "Your note here..." }])
    .select()
    .single();

  return { data, error };
};

/**
 * Updates an existing note.
 * @param {string} noteId - ID of the note to update.
 * @param {string} updatedNote - The updated note text.
 * @returns {object} - Error message if any.
 */

export const updateNote = async (noteId, updatedNote) => {
  const { error } = await supabase
    .from("userNotes")
    .update({ notes: updatedNote })
    .eq("id", noteId);

  return { error };
};
