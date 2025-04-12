import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import FadePageWrapper from "../HOC/FadePageWrapper";
import noteIcon from "../../assets/icons/note-icon.png";
import myCreationsIcon from "../../assets/icons/my-creations-icon.jpg";

const Notes = () => {
  const { session } = UserAuth(); // Get the current user session
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // Separate state for update operations
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedNote, setUpdatedNote] = useState("");

  // Fetch the single note when component mounts or user session changes
  useEffect(() => {
    const fetchNote = async () => {
      console.log("Fetching note...");
      if (!session?.user?.id) return;

      setLoading(true);
      try {
        // Fetch the note if it exists for the user
        const { data, error } = await supabase
          .from("userNotes")
          .select("*")
          .eq("user_id", session.user.id)
          .single(); // Fetch only one note

        if (error && error.code !== "PGRST116") {
          throw new Error(error.message);
          console.error("Error fetching note:", error.message);
        }

        console.log("Fetched note:", data);
        if (!data) {
          // No note exists, create a new default one
          const { data: newNote, error: insertError } = await supabase
            .from("userNotes")
            .insert([{ user_id: session.user.id, notes: "Your note here..." }])
            .select()
            .single();

          if (insertError) {
            // Prevent duplicate insertion error by checking for existing note
            if (insertError.code === "23505") {
              console.log("Note already exists for this user.");
              // Optionally fetch the existing note again
              const { data: existingNote, error: fetchError } = await supabase
                .from("userNotes")
                .select("*")
                .eq("user_id", session.user.id)
                .single();

              if (fetchError) {
                throw new Error(fetchError.message);
              }

              setNote(existingNote); // Use the existing note
            } else {
              throw new Error(insertError.message);
            }
          } else {
            setNote(newNote);
          }
        } else {
          // If note exists, use the existing one
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
      setUpdating(true); // Use updating state instead of loading
      const { error } = await supabase
        .from("userNotes")
        .update({ notes: updatedNote })
        .eq("id", note.id);

      if (error) {
        throw new Error(error.message);
      }

      setNote((prev) => ({ ...prev, notes: updatedNote })); // Update UI
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      setError(err);
    } finally {
      setUpdating(false); // Reset updating state instead of loading
    }
  };

  // Content to render
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
              className="w-full p-4  rounded-md min-h-[100px]"
              disabled={updating} // Disable during update
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={handleUpdateNote}
                disabled={updating} // Disable during update
                className={`${
                  updating
                    ? "bg-gray-400"
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
