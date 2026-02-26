function TaskItem({ task, onToggleComplete }) {
  return (
    <div
      className={`
        flex items-center gap-2 px-2 py-1.5 rounded-lg
        text-xs transition-colors cursor-pointer group
        ${task.completed 
          ? 'bg-gray-800/30 text-gray-500 hover:bg-gray-800/50' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }
      `}
    >
      <button 
        onClick={(e) => onToggleComplete(task.id, e)}
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
      <span className={`flex-1 truncate ${task.completed ? 'line-through text-gray-500' : ''}`}>
        {task.title}
      </span>
    </div>
  )
}

export default TaskItem