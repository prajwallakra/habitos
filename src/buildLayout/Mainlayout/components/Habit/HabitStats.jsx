function HabitStats({ totalHabits, completedToday, completionRate }) {
  return (
    <div className="flex gap-2">
      <div className="bg-[#1f1f1f] px-3 py-1 rounded-full text-xs border border-[#2a2a2a]">
        <span className="text-[#9c9c9c]">Total: </span>
        <span className="text-white font-medium">{totalHabits}</span>
      </div>
      <div className="bg-[#1f1f1f] px-3 py-1 rounded-full text-xs border border-[#2a2a2a]">
        <span className="text-[#9c9c9c]">Today: </span>
        <span className="text-green-400 font-medium">{completedToday}/{totalHabits}</span>
      </div>
      {totalHabits > 0 && (
        <div className="bg-[#1f1f1f] px-3 py-1 rounded-full text-xs border border-[#2a2a2a]">
          <span className="text-[#9c9c9c]">Rate: </span>
          <span className="text-indigo-400 font-medium">{completionRate}%</span>
        </div>
      )}
    </div>
  )
}

export default HabitStats