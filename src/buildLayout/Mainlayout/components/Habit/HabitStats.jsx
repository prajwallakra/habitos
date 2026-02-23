function HabitStats({ totalHabits, completedToday, completionRate }) {
  return (
    <div className="flex gap-2">

      <div className="bg-(--bg-hover) px-3 py-1 rounded-full text-xs border border-(--border)">
        <span className="text-(--text-secondary)">Total: </span>
        <span className="text-(--text-primary) font-medium">
          {totalHabits}
        </span>
      </div>

      <div className="bg-(--bg-hover) px-3 py-1 rounded-full text-xs border border-(--border)">
        <span className="text-(--text-secondary)">Today: </span>
        <span className="text-green-400 font-medium">
          {completedToday}/{totalHabits}
        </span>
      </div>

      {totalHabits > 0 && (
        <div className="bg-(--bg-hover) px-3 py-1 rounded-full text-xs border border-(--border)">
          <span className="text-(--text-secondary)">Rate: </span>
          <span className="text-indigo-400 font-medium">
            {completionRate}%
          </span>
        </div>
      )}

    </div>
  )
}

export default HabitStats