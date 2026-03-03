import { useContext, useState } from "react";
import { useApp } from "../../../context/AppContext";

function NotesSection({ notes, updateNotes, isNotesFocused, setIsNotesFocused }) {

  const [content, setContent] = useState("");
  const { addNote, todaysNotes, deleteNote } = useApp();


  const handleAddNote = () => {
    if (!content) return
    const newNote = {
      date: new Date().toISOString().split('T')[0],
      id: crypto.randomUUID(),
      content: content
    }
    addNote(newNote);
    setContent("");
  }


  return (
    <div className="border-t border-(--border) p-5 mb-2">

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-(--text-secondary) uppercase tracking-wider">
          Notes
        </h3>
        {todaysNotes?.[0]?.notes?.length}
      </div>

      <div className="space-y-1 max-h-75 overflow-y-auto custom-scroll">
        {todaysNotes?.[0]?.notes?.map((note) => {
          return (<Note key={note.id} note={note} deleteNote={deleteNote} />)
        })}
      </div>

      <div className="space-y-2">
        <div
          className={`
          rounded-lg transition-all duration-200
          ${isNotesFocused ? "ring-1 ring-indigo-600" : ""}
        `}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsNotesFocused(true)}
            onBlur={() => setIsNotesFocused(false)}
            placeholder="Write your notes here..."
            className="
            w-full resize-none bg-transparent
            text-sm text-(--text-primary)
            placeholder-(--text-secondary)
            outline-none min-h-25
          "
            style={{ lineHeight: "1.6" }}
          />
        </div>
        <button className="py-2 px-4 bg-(--bg-hover) font-semibold w-full rounded-md hover:bg-(--bg-main) active:scale-95" onClick={() => handleAddNote()}>
          <span className="text-center">Add Note</span>
        </button>
      </div>


      <div className="mt-2 text-right">
        <span className="text-xs text-(--text-secondary) opacity-70">
          {content.length} characters
        </span>
      </div>

    </div>
  )
}



const Note = ({ note, deleteNote }) => {
  return (
    <div className="group relative p-3 hover:bg-(--bg-hover) rounded-sm">

      <p className="text-sm line-clamp-5">{note.content}</p>
      <button className="absolute hidden top-1 right-1 p-2 rounded-full group-hover:block group-hover:bg-(--bg-main)" onClick={() => deleteNote(note.id)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-icon lucide-trash group-hover:text-red-500"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
      </button>
    </div>
  )
}

export default NotesSection