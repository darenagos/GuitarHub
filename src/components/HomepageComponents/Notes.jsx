import React, { useState, useEffect } from "react";
import { UserAuth } from "../../context/AuthContext";
import FadePageWrapper from "../HOC/FadePageWrapper";
import noteIcon from "../../assets/icons/note-icon.png";
import myCreationsIcon from "../../assets/icons/my-creations-icon.jpg";
import {
  addDefaultNote,
  fetchNote,
  updateNote,
} from "../../services/songService";

/**
 * Notes component allows a user to view and update a single personal note.
 * Automatically creates a default note if none exists for the user.
 */

const Notes = () => {
  const { session } = UserAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedNote, setUpdatedNote] = useState("");

  // Fetch the single note when component mounts or user session changes
  // ...existing code...
  // Fetch the single note when component mounts or user session changes
  useEffect(() => {
    const handleFetchNote = async () => {
      if (!session?.user?.id) return;

      setLoading(true);
      setError(null); // Clear any previous errors

      try {
        // Fetch the note if it exists for the user
        const { data, error } = await fetchNote(session.user.id);

        // If data exists, set it and return early
        if (data) {
          setNote(data);
          setLoading(false);
          return;
        }

        // Only attempt to create a note if fetch didn't return data
        // This helps prevent race conditions
        if (!data) {
          try {
            const { data: newNote, error: insertError } = await addDefaultNote(
              session.user.id
            );

            if (newNote) {
              setNote(newNote);
            } else if (insertError?.code === "23505") {
              // If we got a duplicate error, try fetching one more time
              const { data: existingNote } = await fetchNote(session.user.id);
              if (existingNote) {
                setNote(existingNote);
              }
            } else if (insertError) {
              throw new Error(insertError.message);
            }
          } catch (insertErr) {
            console.error("Error creating default note:", insertErr);
            setError(insertErr);
          }
        }
      } catch (err) {
        console.error("Error in note handling:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    handleFetchNote();
  }, [session?.user?.id]);

  /**
   * Update note content in the database and UI
   */
  const handleUpdateNote = async () => {
    if (!note) return;

    try {
      setUpdating(true);
      const { error } = await updateNote(note.id, updatedNote);

      if (error) {
        throw new Error(error.message);
      }

      setNote((prev) => ({ ...prev, notes: updatedNote }));
      setIsEditing(false);
    } catch (err) {
      setError(err);
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Renders note display or editing interface depending on `isEditing` state
   */
  const renderContent = () => {
    if (loading) {
      return <p className="min-h-[100px]"></p>;
    }

    if (error) {
      console.error("Error:", error.message);
      return <p className="text-red-500">Error: {error.message}</p>;
    }

    return (
      <div className="bg-white mt-6 p-4 rounded-md shadow-md break-words min-h-[150px]">
        {isEditing ? (
          <>
            <textarea
              value={updatedNote}
              onChange={(e) => setUpdatedNote(e.target.value)}
              className={`w-full p-4 rounded-md min-h-[100px] ${
                isEditing ? "border-2 border-gray-200" : ""
              }`}
              disabled={updating}
              placeholder="Write your note here..."
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={handleUpdateNote}
                disabled={updating}
                className={`${
                  updating
                    ? "bg-white"
                    : "bg-white shadow p-2 rounded-md transition-shadow ease-in-out duration-300 hover:shadow-[0_0_10px_4px_rgba(255,220,2,0.6)]"
                }  p-2 rounded-md transition-colors`}
              >
                {updating ? "Saving..." : "Update Note"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={updating}
                className="bg-white shadow p-2 rounded-md transition-shadow ease-in-out duration-300 hover:shadow-[0_0_10px_4px_rgba(255,220,2,0.6)]"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="whitespace-pre-wrap min-h-[100px]">{note?.notes}</p>

            <button
              onClick={() => {
                setIsEditing(true);
                setUpdatedNote(note.notes);
              }}
              className="bg-white flex p-2 rounded-md shadow mt-2 hover:scale-110 transition ease-in-out"
            >
              Edit
              <img src={myCreationsIcon} className="h-7 w-7" />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <FadePageWrapper>
      <div className="max-w-4xl mx-auto mb-8 px-6">
        <div className="flex items-center">
          <h2 className="text-l font-semibold">My Note</h2>
          <img src={noteIcon} className="h-8 w-auto ml-4 " alt="note icon" />
        </div>
        {renderContent()}
      </div>
    </FadePageWrapper>
  );
};

export default Notes;
