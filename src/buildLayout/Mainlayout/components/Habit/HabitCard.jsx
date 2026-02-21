import { useMemo } from "react"

function HabitCard({ habit, onClick, onEdit, onDelete }) {
  // Calculate circle properties
  const { size, strokeWidth, radius, circumference, offset, progressColor } = useMemo(() => {
    const size = 120
    const strokeWidth = 8
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (habit.completionRate / 100) * circumference

    // Determine color based on completion rate
    const getProgressColor = () => {
      if (habit.completionRate >= 70) return "#10b981" // green
      if (habit.completionRate >= 40) return "#f59e0b" // amber
      return "#ef4444" // red
    }

    return {
      size,
      strokeWidth,
      radius,
      circumference,
      offset,
      progressColor: getProgressColor()
    }
  }, [habit.completionRate])

  return (
    <div 
      onClick={onClick}
      className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg p-5 hover:border-indigo-500/50 hover:bg-[#252525] transition-all group relative cursor-pointer"
    >
      {/* Edit/Delete buttons */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={onEdit} className="p-1.5 bg-[#2a2a2a] rounded-md hover:bg-[#333333]">
          <EditIcon />
        </button>
        <button onClick={onDelete} className="p-1.5 bg-[#2a2a2a] rounded-md hover:bg-red-500/20">
          <DeleteIcon />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex items-start gap-4">
        {/* Circular Progress */}
        <CircularProgress 
          size={size}
          radius={radius}
          strokeWidth={strokeWidth}
          circumference={circumference}
          offset={offset}
          progressColor={progressColor}
          completedDays={habit.completedDays}
        />

        {/* Habit Info */}
        <HabitInfo habit={habit} />
      </div>

      {/* Mini progress bar for today */}
      {habit.totalToday > 0 && (
        <TodayProgressBar progress={habit.progress} color={habit.color} />
      )}
    </div>
  )
}

// Sub-components
function EditIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function CircularProgress({ size, radius, strokeWidth, circumference, offset, progressColor, completedDays }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{completedDays}</span>
        <span className="text-[10px] text-[#9c9c9c]">/365</span>
      </div>
    </div>
  )
}

function HabitInfo({ habit }) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-white font-semibold text-lg truncate">{habit.name}</h3>
      
      <div className="mt-3 space-y-2">
        <StatRow 
          label="Today" 
          value={`${habit.completedToday}/${habit.totalToday}`}
          valueClass={habit.completedToday > 0 ? 'text-green-400 font-medium' : 'text-[#9c9c9c]'}
        />
        
        <StatRow 
          label={<><span>🔥</span> Streak</>} 
          value={`${habit.streak} days`}
          valueClass="text-white font-medium"
        />
        
        <StatRow 
          label="Success Rate" 
          value={`${habit.completionRate}%`}
          valueClass="text-indigo-400 font-medium"
        />

        <div className="flex items-center gap-1 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
          <span className="text-[10px] text-[#6b6b6b] truncate">
            {habit.description || 'No description'}
          </span>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value, valueClass }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[#9c9c9c]">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}

function TodayProgressBar({ progress, color }) {
  return (
    <div className="mt-4">
      <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default HabitCard