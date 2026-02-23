function NotesSection({ notes, updateNotes, isNotesFocused, setIsNotesFocused }) {
  return (
    <div className="border-t border-(--border) p-5">

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-(--text-secondary) uppercase tracking-wider">
          Notes
        </h3>

        {notes && (
          <span className="text-xs text-(--text-secondary) opacity-70">
            {notes.split("\n").filter(line => line.trim()).length} lines
          </span>
        )}
      </div>

      <div
        className={`
          rounded-lg transition-all duration-200
          ${isNotesFocused ? "ring-1 ring-indigo-600" : ""}
        `}
      >
        <textarea
          value={notes}
          onChange={(e) => updateNotes(e.target.value)}
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

      {notes && (
        <div className="mt-2 text-right">
          <span className="text-xs text-(--text-secondary) opacity-70">
            {notes.length} characters
          </span>
        </div>
      )}
    </div>
  )
}

export default NotesSection