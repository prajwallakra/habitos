function NotesSection({ notes, updateNotes, isNotesFocused, setIsNotesFocused }) {
  return (
    <div className="border-t border-[#2a2a2a] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-[#9c9c9c] uppercase tracking-wider">
          Notes
        </h3>
        {notes && (
          <span className="text-xs text-[#6b6b6b]">
            {notes.split('\n').filter(line => line.trim()).length} lines
          </span>
        )}
      </div>

      <div className={`
        rounded-lg transition-all duration-200
        ${isNotesFocused ? 'ring-1 ring-[#4f46e5]' : ''}
      `}>
        <textarea
          value={notes}
          onChange={(e) => updateNotes(e.target.value)}
          onFocus={() => setIsNotesFocused(true)}
          onBlur={() => setIsNotesFocused(false)}
          placeholder="Write your notes here..."
          className="w-full resize-none bg-transparent text-sm text-[#e4e4e4] placeholder-[#6b6b6b] outline-none min-h-25"
          style={{ lineHeight: '1.6' }}
        />
      </div>

      {notes && (
        <div className="mt-2 text-right">
          <span className="text-xs text-[#6b6b6b]">
            {notes.length} characters
          </span>
        </div>
      )}
    </div>
  )
}

export default NotesSection