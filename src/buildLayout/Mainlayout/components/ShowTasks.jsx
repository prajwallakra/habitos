import { useApp } from "../../../context/AppContext"

function ShowTasks({ date, mode = "list", onTaskClick }) {
  const { tasks, updateTask } = useApp()

  // Get tasks for this date
  const dayTasks = tasks.filter(task => task.date === date)
  const completedTasks = dayTasks.filter(t => t.completed).length
  const totalTasks = dayTasks.length

  /* ---------- toggle task completion ---------- */
  function toggleTaskCompletion(taskId, e) {
    e.stopPropagation()
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      // Toggle between completed and not-started
      const newCompleted = !task.completed
      updateTask(taskId, { 
        completed: newCompleted,
        status: newCompleted ? "completed" : "not-started"
      })
    }
  }

  /* ---------- handle task click for editing ---------- */
  function handleTaskClick(task, e) {
    e.stopPropagation()
    if (onTaskClick) {
      onTaskClick(task)
    }
  }

  // COUNTER MODE - Only show the count
  if (mode === "counter") {
    if (totalTasks === 0) return null
    
    return (
      <span className={`
        text-xs px-2 py-1 rounded-full
        ${completedTasks === totalTasks 
          ? 'bg-green-500/20 text-green-400'
          : 'bg-indigo-500/20 text-indigo-400'
        }
      `}>
        {completedTasks}/{totalTasks}
      </span>
    )
  }

  // LIST MODE - Only show the tasks
  return (
    <div className="space-y-1.5">
      {dayTasks.length > 0 ? (
        <>
          {dayTasks.slice(0, 4).map(task => (
            <div
              key={task.id}
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded-lg
                text-xs transition-colors cursor-pointer group
                ${task.completed 
                  ? 'bg-gray-800/30 text-gray-500 hover:bg-gray-800/50' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }
              `}
              onClick={(e) => handleTaskClick(task, e)}
            >
              {/* Custom Checkbox */}
              <button
                onClick={(e) => toggleTaskCompletion(task.id, e)}
                className={`
                  w-4 h-4 rounded flex items-center justify-center
                  transition-all duration-200 shrink-0
                  ${task.completed
                    ? 'bg-green-500 text-white'
                    : 'border border-gray-500 hover:border-indigo-500'
                  }
                `}
              >
                {task.completed && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              {/* Task Title with cut effect when completed */}
              <span className={`
                flex-1 truncate transition-all
                ${task.completed ? 'line-through text-gray-500' : ''}
              `}>
                {task.title}
              </span>

              {/* Status indicator */}
              {!task.completed && task.status === "ongoing" && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full shrink-0">
                  Ongoing
                </span>
              )}

              {/* Priority Dot */}
              {task.priority === 'high' && !task.completed && (
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              )}
              {task.priority === 'medium' && !task.completed && (
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full shrink-0" />
              )}

              {/* Edit indicator - subtle pencil icon on hover */}
              <svg 
                className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          ))}
          
          {/* More tasks indicator */}
          {dayTasks.length > 4 && (
            <div className="text-xs text-gray-500 text-center py-1">
              +{dayTasks.length - 4} more
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="flex items-center justify-center h-20 text-gray-600 text-xs">
          No tasks
        </div>
      )}
    </div>
  )
}

export default ShowTasks