function Header({ selectedDate, totalTasks, completedTasks, completionRate }) {
  return (
    <div className="p-5 border-b border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-medium text-[#9c9c9c] uppercase tracking-wider">
          Daily Overview
        </h2>
        {totalTasks > 0 && (
          <span className="text-xs text-[#9c9c9c]">
            {completedTasks}/{totalTasks}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">
          {new Date(selectedDate).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric' 
          })}
        </h1>
        {totalTasks > 0 && (
          <div className="text-sm font-medium text-[#9c9c9c]">
            {completionRate}%
          </div>
        )}
      </div>

      {totalTasks > 0 && (
        <div className="mt-3 h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#4f46e5] rounded-full transition-all duration-300" 
            style={{ width: `${completionRate}%` }} 
          />
        </div>
      )}
    </div>
  )
}

export default Header