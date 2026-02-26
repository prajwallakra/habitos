function HabitFilters({ filter, onFilterChange, onAddHabit }) {
  return (
    <div className="flex items-center gap-3">
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="
          bg-(--bg-hover)
          border border-(--border)
          rounded-lg px-3 py-1.5 text-sm
          text-(--text-primary)
          focus:outline-none focus:border-indigo-500
        "
      >
        <option value="all">All Habits</option>
        <option value="active">Active Today</option>
        <option value="completed">Completed Today</option>
      </select>

      <button
        onClick={onAddHabit}
        className="
          px-4 py-1.5
          bg-indigo-600 text-white
          rounded-lg hover:bg-indigo-500
          transition-colors flex items-center gap-2 text-sm
        "
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        New Habit
      </button>
    </div>
  )
}

export default HabitFilters