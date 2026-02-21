import { useState, useEffect } from "react"
import { useApp } from "../../../../context/AppContext"
import HabitForm from "../Habit/HabitForm"

function AddTaskModal({ date, onClose, taskToEdit = null }) {
  const { habits, addTask, updateTask, deleteTask } = useApp()
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [showHabitPopup, setShowHabitPopup] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")
  const [note, setNote] = useState("")
  const [habitId, setHabitId] = useState("")
  const [status, setStatus] = useState("not-started")

  // Filter habits based on search
  const filteredHabits = habits.filter(habit =>
    habit.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Load task data if editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "")
      setPriority(taskToEdit.priority || "medium")
      setNote(taskToEdit.note || "")
      setHabitId(taskToEdit.habitId || "")
      
      if (taskToEdit.completed) {
        setStatus("completed")
      } else {
        setStatus(taskToEdit.status || "not-started")
      }
    } else {
      setTitle("")
      setPriority("medium")
      setNote("")
      setHabitId("")
      setStatus("not-started")
    }
  }, [taskToEdit])

  /* ---------- submit ---------- */
  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    const isCompleted = status === "completed"

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title,
        date: taskToEdit.date,
        habitId: habitId || null,
        priority,
        note,
        completed: isCompleted,
        status
      })
    } else {
      addTask({
        id: crypto.randomUUID(),
        title,
        date,
        habitId: habitId || null,
        priority,
        note,
        completed: isCompleted,
        status
      })
    }
    onClose()
  }

  /* ---------- handle delete ---------- */
  function handleDelete() {
    if (taskToEdit && window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskToEdit.id)
      onClose()
    }
  }

  const isEditing = !!taskToEdit

  const getStatusButtonClass = (value) => {
    if (status === value) {
      switch(value) {
        case "completed":
          return "bg-green-600 text-white shadow-lg"
        case "ongoing":
          return "bg-blue-600 text-white shadow-lg"
        default:
          return "bg-gray-600 text-white shadow-lg"
      }
    }
    return "bg-[#111111] text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-300"
  }

  const selectedHabit = habits.find(h => h.id === habitId)

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div 
          className="bg-[#0a0a0a] rounded-2xl w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 pb-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h2>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              
              {!isEditing && <div className="w-9" />}
            </div>
            
            <p className="text-sm text-gray-400 mt-2">
              {new Date(isEditing ? taskToEdit.date : date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Task Title
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Morning run, Team meeting..."
                className="w-full bg-[#111111] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                autoFocus
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </label>
              <div className="flex gap-2">
                {["not-started", "ongoing", "completed"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`
                      flex-1 px-3 py-2.5 rounded-xl text-sm capitalize transition-all
                      ${getStatusButtonClass(s)}
                    `}
                  >
                    {s.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Habit Selection - Compact Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Habit (Optional)
              </label>
              
              <button
                type="button"
                onClick={() => setShowHabitPopup(true)}
                className="w-full bg-[#111111] hover:bg-[#1a1a1a] rounded-xl px-4 py-3 text-left transition-all flex items-center justify-between group"
              >
                {selectedHabit ? (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedHabit.color }}
                    />
                    <span className="text-white">{selectedHabit.name}</span>
                    {selectedHabit.targetDays && (
                      <span className="text-xs text-gray-500">
                        ({selectedHabit.targetDays} days)
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">Select a habit...</span>
                )}
                <svg 
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Priority Level
              </label>
              <div className="flex gap-2">
                {["low", "medium", "high"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`
                      flex-1 px-3 py-2.5 rounded-xl capitalize transition-all
                      ${priority === p 
                        ? `bg-indigo-600 text-white shadow-lg` 
                        : `bg-[#111111] text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-300`
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add any additional details..."
                rows="3"
                className="w-full bg-[#111111] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={!title.trim()}
                className={`
                  w-full px-4 py-3 rounded-xl font-medium transition-all
                  ${title.trim()
                    ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-500'
                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isEditing ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Habit Selection Popup */}
      {showHabitPopup && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4"
          onClick={() => setShowHabitPopup(false)}
        >
          <div 
            className="bg-[#171717] rounded-xl w-full max-w-md border border-[#2a2a2a] max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Select Habit</h3>
              <button
                onClick={() => setShowHabitPopup(false)}
                className="p-1 hover:bg-[#2a2a2a] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-[#2a2a2a]">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search habits..."
                  className="w-full bg-[#1f1f1f] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-10"
                  autoFocus
                />
                <svg 
                  className="absolute left-3 top-3 w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Habits List */}
            <div className="p-2 overflow-y-auto max-h-100">
              {/* None Option */}
              <button
                onClick={() => {
                  setHabitId("")
                  setShowHabitPopup(false)
                  setSearchTerm("")
                }}
                className="w-full text-left px-4 py-3 hover:bg-[#1f1f1f] rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">None</p>
                    <p className="text-xs text-gray-500">No habit associated</p>
                  </div>
                </div>
              </button>

              {/* Habits */}
              {filteredHabits.map(habit => (
                <button
                  key={habit.id}
                  onClick={() => {
                    setHabitId(habit.id)
                    setShowHabitPopup(false)
                    setSearchTerm("")
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-[#1f1f1f] rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${habit.color}20` }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{habit.name}</p>
                        {habit.targetDays && (
                          <span className="text-xs px-2 py-0.5 bg-[#2a2a2a] rounded-full text-gray-400">
                            {habit.targetDays}d
                          </span>
                        )}
                      </div>
                      {habit.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{habit.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {/* Create New Habit Option */}
              <button
                onClick={() => {
                  setShowHabitPopup(false)
                  setShowHabitForm(true)
                  setSearchTerm("")
                }}
                className="w-full text-left px-4 py-3 mt-2 border-t border-[#2a2a2a] pt-4 hover:bg-[#1f1f1f] rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-indigo-400 font-medium">Create New Habit</p>
                    <p className="text-xs text-gray-500">Add a new habit to track</p>
                  </div>
                </div>
              </button>

              {/* Empty State */}
              {filteredHabits.length === 0 && searchTerm && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No habits found</p>
                  <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Habit Form Modal */}
      {showHabitForm && (
        <HabitForm
          onClose={() => {
            setShowHabitForm(false)
            // Optionally, you could automatically select the newly created habit
            // The new habit will be added to the context and appear in the list
          }}
        />
      )}
    </>
  )
}

export default AddTaskModal