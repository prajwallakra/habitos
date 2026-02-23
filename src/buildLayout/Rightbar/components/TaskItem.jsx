function TaskItem({ task, onToggleComplete }) {
  return (
    <div
      className={`
        flex items-center gap-2 px-2 py-1.5 rounded-lg
        text-xs transition-colors cursor-pointer group
        ${
          task.completed
            ? "bg-(--bg-hover) text-(--text-secondary) opacity-70 hover:opacity-90"
            : "bg-(--bg-hover) text-(--text-primary) hover:opacity-80"
        }
      `}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => onToggleComplete(task.id, e)}
        className={`
          w-4 h-4 rounded flex items-center justify-center
          transition-all duration-200 shrink-0
          ${
            task.completed
              ? "bg-green-500 text-white"
              : "border border-(--border) hover:border-indigo-500"
          }
        `}
      >
        {task.completed && (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className={`
          flex-1 truncate transition-all
          ${
            task.completed
              ? "line-through text-(--text-secondary)"
              : ""
          }
        `}
      >
        {task.title}
      </span>
    </div>
  )
}

export default TaskItem