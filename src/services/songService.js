// songService.js

const API_KEY = "05955013";
import { supabase } from "../supabaseClient";

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

export const fetchUserSongs = async (userId) => {
  if (!userId) return { error: "User not authenticated" };
  const { data, error } = await supabase
    .from("usersChordProgressions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return { data, error };
};

export const fetchUserSongById = async (userId, songId) => {
  if (!userId) return { error: "User not authenticated" };

  const { data, error } = await supabase
    .from("usersChordProgressions")
    .select("*")
    .eq("user_id", userId)
    .eq("id", songId)
    .single(); // We use `.single()` since we're expecting only one song

  if (error) {
    console.error("Error fetching song by ID:", error);
    return { error: error.message };
  }

  return { data };
};

export const deleteSong = async (id) => {
  const { error } = await supabase.from("songs").delete().eq("id", id);

  return { error };
};

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

export const deleteCustomSong = async (id) => {
  const { error } = await supabase
    .from("usersChordProgressions")
    .delete()
    .eq("id", id);
  return { error };
};

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

export const updateStatus = async (id, newStatus) => {
  const { error } = await supabase
    .from("songs")
    .update({ status: newStatus })
    .eq("id", id);

  return { error, newStatus };
};

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

export const fetchLearningSongs = async (userId) => {
  if (!userId) return { error: "User not authenticated" };

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
};

// notes database operations
export const fetchNote = async (userId) => {
  if (!userId) return { error: "User not authenticated" };
  const { data, error } = await supabase
    .from("userNotes")
    .select("*")
    .eq("user_id", userId)
    .single();

  return { data, error };
};

export const addDefaultNote = async (userId) => {
  const { data: newNote, error: insertError } = await supabase
    .from("userNotes")
    .insert([{ user_id: userId, notes: "Your note here..." }])
    .select()
    .single();

  return { newNote, insertError };
};

export const updateNote = async (noteId, updatedNote) => {
  const { error } = await supabase
    .from("userNotes")
    .update({ notes: updatedNote })
    .eq("id", noteId);

  return { error };
};
