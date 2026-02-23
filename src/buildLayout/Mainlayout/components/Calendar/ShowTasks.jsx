import { useApp } from "../../../../context/AppContext"

function ShowTasks({ date, mode = "list", onTaskClick }) {
  const { tasks, updateTask } = useApp()

  const dayTasks = tasks.filter(task => task.date === date)
  const completedTasks = dayTasks.filter(t => t.completed).length
  const totalTasks = dayTasks.length

  function toggleTaskCompletion(taskId, e) {
    e.stopPropagation()
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      const newCompleted = !task.completed
      updateTask(taskId, {
        completed: newCompleted,
        status: newCompleted ? "completed" : "not-started"
      })
    }
  }

  function handleTaskClick(task, e) {
    e.stopPropagation()
    if (onTaskClick) onTaskClick(task)
  }

  /* ===== COUNTER MODE ===== */
  if (mode === "counter") {
    if (totalTasks === 0) return null

    return (
      <span
        className={`
          text-xs px-2 py-1 rounded-full
          ${
            completedTasks === totalTasks
              ? "bg-green-500/20 text-green-400"
              : "bg-indigo-500/20 text-indigo-400"
          }
        `}
      >
        {completedTasks}/{totalTasks}
      </span>
    )
  }

  /* ===== LIST MODE ===== */
  return (
    <div className="space-y-1.5">
      {dayTasks.length > 0 ? (
        <>
          {dayTasks.slice(0, 4).map(task => (
            <div
              key={task.id}
              onClick={(e) => handleTaskClick(task, e)}
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded-lg
                text-xs transition-colors cursor-pointer group
                ${
                  task.completed
                    ? "bg-(--bg-hover) text-(--text-secondary) opacity-70"
                    : "bg-(--bg-hover) text-(--text-primary) hover:opacity-80"
                }
              `}
            >
              {/* Checkbox */}
              <button
                onClick={(e) => toggleTaskCompletion(task.id, e)}
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

              {/* Ongoing badge */}
              {!task.completed && task.status === "ongoing" && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full shrink-0">
                  Ongoing
                </span>
              )}

              {/* Priority dots */}
              {task.priority === "high" && !task.completed && (
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              )}
              {task.priority === "medium" && !task.completed && (
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full shrink-0" />
              )}

              {/* Edit icon */}
              <svg
                className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-(--text-secondary) shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          ))}

          {/* More indicator */}
          {dayTasks.length > 4 && (
            <div className="text-xs text-(--text-secondary) text-center py-1">
              +{dayTasks.length - 4} more
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-20 text-(--text-secondary) text-xs">
          No tasks
        </div>
      )}
    </div>
  )
}

export default ShowTasks