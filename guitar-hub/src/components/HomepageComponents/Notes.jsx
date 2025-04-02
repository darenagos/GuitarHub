import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import FadePageWrapper from "../HOC/FadePageWrapper";

const Notes = () => {
  const { session } = UserAuth(); // Get the current user session
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedNote, setUpdatedNote] = useState("");

  // Fetch the single note when component mounts or user session changes
  useEffect(() => {
    const fetchNote = async () => {
      if (!session?.user?.id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("userNotes")
          .select("*")
          .eq("user_id", session.user.id)
          .single(); // Fetch only one note

        if (error && error.code !== "PGRST116") {
          throw new Error(error.message);
        }

        if (!data) {
          // No note exists, create a new default one
          const { data: newNote, error: insertError } = await supabase
            .from("userNotes")
            .insert([{ user_id: session.user.id, notes: "Your note here..." }])
            .select()
            .single();

          if (insertError) {
            throw new Error(insertError.message);
          }

          setNote(newNote);
        } else {
          setNote(data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [session?.user?.id]);

  // Handle updating the note
  const handleUpdateNote = async () => {
    if (!note) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("userNotes")
        .update({ notes: updatedNote }) // Fixed column name
        .eq("id", note.id);

      if (error) {
        throw new Error(error.message);
      }

      setNote((prev) => ({ ...prev, notes: updatedNote })); // Update UI
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadePageWrapper>
      <div className="max-w-4xl mx-auto mb-8 px-6">
        <h2 className="text-l font-semibold mb-4">Your Note</h2>

        {/* Display Note */}
        {loading ? (
          <p></p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <div className="mt-6 p-4 border rounded-md shadow-md break-words">
            {isEditing ? (
              <>
                <textarea
                  value={updatedNote}
                  onChange={(e) => setUpdatedNote(e.target.value)}
                  className="w-full p-4 border rounded-md "
                />
                <button
                  onClick={handleUpdateNote}
                  className="bg-green-500 text-white p-2 rounded-md mt-2"
                >
                  Update Note
                </button>
              </>
            ) : (
              <>
                <p>{note?.notes}</p> {/* Fixed display field */}
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setUpdatedNote(note.notes);
                  }}
                  className="bg-blue-500 text-white p-2 rounded-md mt-2"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </FadePageWrapper>
  );
};

export default Notes;
