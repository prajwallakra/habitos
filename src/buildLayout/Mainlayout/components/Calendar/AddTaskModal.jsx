import { useState, useEffect } from "react"
import { useApp } from "../../../../context/AppContext"
import HabitForm from "../Habit/HabitForm"
import ConfirmModal from "../ConfirmModal"

function AddTaskModal({ date, onClose, taskToEdit = null }) {
  const { habits, addTask, updateTask, deleteTask } = useApp()
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")
  const [note, setNote] = useState("")
  const [habitId, setHabitId] = useState("")
  const [status, setStatus] = useState("not-started")

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "")
      setPriority(taskToEdit.priority || "medium")
      setNote(taskToEdit.note || "")
      setHabitId(taskToEdit.habitId || "")
      setStatus(taskToEdit.completed ? "completed" : (taskToEdit.status || "not-started"))
    } else {
      setTitle("")
      setPriority("medium")
      setNote("")
      setHabitId("")
      setStatus("not-started")
    }
  }, [taskToEdit])

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

  function handleDelete() {
    if (!taskToEdit) return
    setShowDeleteConfirm(true)
  }

  function confirmDeleteTask() {
    if (!taskToEdit) return
    deleteTask(taskToEdit.id)
    setShowDeleteConfirm(false)
    onClose()
  }

  const isEditing = !!taskToEdit

  const getStatusButtonClass = (value) => {
    if (status === value) {
      switch (value) {
        case "completed":
          return "bg-green-600 text-white shadow-lg"
        case "ongoing":
          return "bg-blue-600 text-white shadow-lg"
        default:
          return "bg-gray-600 text-white shadow-lg"
      }
    }
    return "bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:opacity-80"
  }

  const selectedHabit = habits.find(h => h.id === habitId)

  const handleHabitFormClose = (newHabitId) => {
    setShowHabitForm(false)
    if (newHabitId) {
      setHabitId(newHabitId)
      setSearchTerm("")
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className="bg-(--bg-card) rounded-2xl w-full max-w-md shadow-2xl border border-(--border)"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 pb-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-(--bg-hover) rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-(--text-secondary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-xl font-semibold text-(--text-primary)">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h2>

              {isEditing ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                >
                  <svg className="w-5 h-5 text-(--text-secondary) group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
                  </svg>
                </button>
              ) : <div className="w-9" />}
            </div>

            <p className="text-sm text-(--text-secondary) mt-2">
              {new Date(isEditing ? taskToEdit.date : date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">

            {/* Title */}
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full bg-(--bg-hover) rounded-xl px-4 py-3 text-(--text-primary) placeholder-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              autoFocus
            />

            {/* Status */}
            <div className="flex gap-2">
              {["not-started", "ongoing", "completed"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-sm capitalize transition-all ${getStatusButtonClass(s)}`}
                >
                  {s.replace("-", " ")}
                </button>
              ))}
            </div>

            {/* Habit Selector */}
            <button
              type="button"
              onClick={() => setShowHabitForm(true)}
              className="w-full bg-(--bg-hover) rounded-xl px-4 py-3 text-left flex justify-between"
            >
              {selectedHabit
                ? <span className="text-(--text-primary)">{selectedHabit.name}</span>
                : <span className="text-(--text-secondary)">Select a habit...</span>}
            </button>

            {/* Priority */}
            <div className="flex gap-2">
              {["low", "medium", "high"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 px-3 py-2.5 rounded-xl capitalize transition-all ${
                    priority === p
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-(--bg-hover) text-(--text-secondary)"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Note */}
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows="3"
              placeholder="Add note..."
              className="w-full bg-(--bg-hover) rounded-xl px-4 py-3 text-(--text-primary) placeholder-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={!title.trim()}
              className={`w-full px-4 py-3 rounded-xl font-medium transition-all ${
                title.trim()
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : "bg-gray-400/30 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isEditing ? "Save Changes" : "Create Task"}
            </button>
          </form>
        </div>
      </div>

      {showHabitForm && (
        <HabitForm onClose={(id) => handleHabitFormClose(id)} />
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Yes"
        cancelText="No"
        onConfirm={confirmDeleteTask}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}

export default AddTaskModal