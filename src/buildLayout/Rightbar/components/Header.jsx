function Header({ selectedDate, totalTasks, completedTasks, completionRate }) {
  return (
    <div className="p-5 border-b border-(--border)">

      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-medium text-(--text-secondary) uppercase tracking-wider">
          Daily Overview
        </h2>

        {totalTasks > 0 && (
          <span className="text-xs text-(--text-secondary)">
            {completedTasks}/{totalTasks}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-(--text-primary)">
          {new Date(selectedDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}
        </h1>

        {totalTasks > 0 && (
          <div className="text-sm font-medium text-(--text-secondary)">
            {completionRate}%
          </div>
        )}
      </div>

      {totalTasks > 0 && (
        <div className="mt-3 h-1 bg-(--border) rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default Header