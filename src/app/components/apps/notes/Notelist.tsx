"use client";
import { Icon } from "@iconify/react";
import React, { useState, useContext, useEffect } from "react";
import { NotesType } from "../../../(DashboardLayout)/types/apps/notes";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { NotesContext } from "@/app/context/NotesContext/index";
import AnimatedItem from "../../animatedComponents/ListAnimation";
import PlaceholdersInput from "@/app/components/animatedComponents/AnimatedInputPlaceholder";

const Notelist = () => {
  const { notes, selectNote, selectedNoteId, deleteNote }: any =
    useContext(NotesContext);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeNoteId, setActiveNoteId] = useState<any | null>(null);

  useEffect(() => {
    if (notes.length > 0) {
      // Set the first note as active
      const firstNoteId = notes[0].id;
      setActiveNoteId(firstNoteId);
    }
  }, [notes]);

  const filterNotes = (notes: NotesType[], nSearch: string) => {
    if (nSearch !== "")
      return notes.filter(
        (t: any) =>
          !t.deleted &&
          t.title
            .toLocaleLowerCase()
            .concat(" ")
            .includes(nSearch.toLocaleLowerCase())
      );
    return notes.filter((t) => !t.deleted);
  };

  const filteredNotes = filterNotes(notes, searchTerm);
  const handleNoteClick = (noteId: any) => {
    setActiveNoteId(noteId);
    selectNote(noteId);
  };

  return (
    <>
      <div className="overflow-hidden">
        <PlaceholdersInput
          value={searchTerm}
          className="pl-3"
          onChange={setSearchTerm}
          placeholders={[
            "Search Notes...",
            "Find Your Notes...",
            "Look up Notes...",
          ]}
        />
        <h6 className="text-base mt-6">All Notes</h6>
        <div className="flex flex-col gap-3 mt-4">
          {filteredNotes && filteredNotes.length ? (
            filteredNotes.map((note, index) => (
              <div key={note.id}>
                <AnimatedItem index={index}>
                  <div
                    className={`cursor-pointer relative p-4 rounded-md bg-light${note.color
                      } dark:bg-dark${note.color}
                  ${activeNoteId === note.id ? "scale-100" : "scale-95"
                      } transition-transform duration-200`}
                    onClick={() => handleNoteClick(note.id)}
                  >
                    <h6 className={`text-base truncate text-${note.color}`}>
                      {note.title}
                    </h6>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-ld">
                        {new Date(note.datef).toLocaleDateString()}
                      </p>
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                aria-label="delete"
                                className="bg-transparent h-8 w-8 text-ld p-0 flex items-center hover:bg-transparent hover:text-error dark:hover:text-error dark:!bg-transparent"
                                onClick={() => deleteNote(note.id)}
                              >
                                <Icon icon="tabler:trash" height={18} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </AnimatedItem>
              </div>
            ))
          ) : (
            <Alert variant="lighterror">
              <Icon icon="tabler:info-circle" height={18} color="red" />
              <AlertTitle className="text-red-500">No Notes Found!</AlertTitle>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
};
export default Notelist;
