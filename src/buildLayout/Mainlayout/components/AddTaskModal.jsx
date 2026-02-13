import { useState, useEffect } from "react"
import { useApp } from "../../../context/AppContext"

function AddTaskModal({ date, onClose, taskToEdit = null }) {
  const { habits, addTask, addHabit, updateTask, deleteTask } = useApp()

  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")
  const [note, setNote] = useState("")
  const [habitId, setHabitId] = useState("")
  const [newHabit, setNewHabit] = useState("")
  const [status, setStatus] = useState("not-started")

  // Load task data if editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "")
      setPriority(taskToEdit.priority || "medium")
      setNote(taskToEdit.note || "")
      setHabitId(taskToEdit.habitId || "")
      
      // Map the completed status correctly
      if (taskToEdit.completed) {
        setStatus("completed")
      } else {
        setStatus(taskToEdit.status || "not-started")
      }
    } else {
      // Reset form for new task
      setTitle("")
      setPriority("medium")
      setNote("")
      setHabitId("")
      setNewHabit("")
      setStatus("not-started")
    }
  }, [taskToEdit])

  /* ---------- submit ---------- */
  function handleSubmit(e) {
    e.preventDefault()

    if (!title.trim()) return

    let finalHabitId = habitId

    /* create habit if new */
    if (habitId === "new") {
      const id = crypto.randomUUID()

      addHabit({
        id,
        name: newHabit,
        color: "#6366f1"
      })

      finalHabitId = id
    }

    // Determine completed status based on status field
    const isCompleted = status === "completed"

    if (taskToEdit) {
      // Update existing task
      console.log("Updating task:", taskToEdit.id, {
        title,
        date: taskToEdit.date,
        habitId: finalHabitId,
        priority,
        note,
        completed: isCompleted,
        status
      })
      
      updateTask(taskToEdit.id, {
        title,
        date: taskToEdit.date,
        habitId: finalHabitId,
        priority,
        note,
        completed: isCompleted,
        status
      })
    } else {
      // Create new task
      console.log("Creating new task:", {
        title,
        date,
        habitId: finalHabitId,
        priority,
        note,
        completed: isCompleted,
        status
      })
      
      addTask({
        id: crypto.randomUUID(),
        title,
        date,
        habitId: finalHabitId,
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

  // Helper function to get color classes
  const getStatusButtonClass = (value, color) => {
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-[#0a0a0a] rounded-2xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close and delete buttons */}
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
            
            {!isEditing && <div className="w-9" />} {/* Spacer for alignment */}
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

          {/* Status - Now shown for both create and edit */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus("not-started")}
                className={`
                  flex-1 px-3 py-2.5 rounded-xl text-sm transition-all
                  ${getStatusButtonClass("not-started", "gray")}
                `}
              >
                Not Started
              </button>
              <button
                type="button"
                onClick={() => setStatus("ongoing")}
                className={`
                  flex-1 px-3 py-2.5 rounded-xl text-sm transition-all
                  ${getStatusButtonClass("ongoing", "blue")}
                `}
              >
                Ongoing
              </button>
              <button
                type="button"
                onClick={() => setStatus("completed")}
                className={`
                  flex-1 px-3 py-2.5 rounded-xl text-sm transition-all
                  ${getStatusButtonClass("completed", "green")}
                `}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Habit Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Habit (Optional)
            </label>
            <select
              value={habitId}
              onChange={e => setHabitId(e.target.value)}
              className="w-full bg-[#111111] rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem'
              }}
            >
              <option value="">None</option>
              {habits.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
              <option value="new">✨ Create New Habit</option>
            </select>
          </div>

          {/* New Habit Input - Conditional */}
          {habitId === "new" && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                New Habit Name
              </label>
              <input
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                placeholder="e.g., Reading, Meditation..."
                className="w-full bg-[#111111] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          )}

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
  )
}

export default AddTaskModal