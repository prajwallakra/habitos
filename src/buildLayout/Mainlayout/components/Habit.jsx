import { useState, useMemo } from "react"
import { useApp } from "../../../context/AppContext"

function Habit() {
  const { habits, tasks, addHabit, updateHabit, deleteHabit } = useApp()
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [selectedHabit, setSelectedHabit] = useState(null) // For detailed view modal
  const [filter, setFilter] = useState("all") // "all", "active", "completed"

  // Get today's date
  const today = new Date().toISOString().split('T')[0]

  // Calculate stats
  const totalHabits = habits.length
  const habitsCompletedToday = habits.filter(habit => {
    const habitTasks = tasks.filter(t => t.habitId === habit.id && t.date === today)
    return habitTasks.some(t => t.completed)
  }).length

  // Process habits with yearly data (365 days)
  const habitsWithData = useMemo(() => {
    return habits.map(habit => {
      const habitTasks = tasks.filter(t => t.habitId === habit.id)
      const todayTasks = habitTasks.filter(t => t.date === today)
      const completedToday = todayTasks.filter(t => t.completed).length
      const totalToday = todayTasks.length
      
      // Get last 365 days completion
      const last365Days = Array.from({ length: 365 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        const dayTasks = habitTasks.filter(t => t.date === dateStr)
        return {
          date: dateStr,
          completed: dayTasks.some(t => t.completed),
          count: dayTasks.length
        }
      })

      // Calculate total completed days in last 365 days
      const completedDays = last365Days.filter(d => d.completed).length
      
      // Calculate streak
      let streak = 0
      let currentDate = new Date()
      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const dayTasks = habitTasks.filter(t => t.date === dateStr)
        if (dayTasks.some(t => t.completed)) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
      }

      // Calculate completion rate
      const completionRate = Math.round((completedDays / 365) * 100)

      return {
        ...habit,
        todayTasks,
        completedToday,
        totalToday,
        progress: totalToday > 0 ? (completedToday / totalToday) * 100 : 0,
        streak,
        completedDays,
        completionRate,
        totalTasks: habitTasks.length,
        completedTasks: habitTasks.filter(t => t.completed).length,
        last365Days
      }
    })
  }, [habits, tasks])

  // Filter habits
  const filteredHabits = habitsWithData.filter(habit => {
    if (filter === "active") return habit.totalToday > 0
    if (filter === "completed") return habit.completedToday > 0
    return true
  })

  return (
    <div className="bg-[#171717] border border-[#2a2a2a] rounded-xl p-6">
      {/* Header with Stats and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Quick Stats Pills */}
          <div className="flex gap-2">
            <div className="bg-[#1f1f1f] px-3 py-1 rounded-full text-xs border border-[#2a2a2a]">
              <span className="text-[#9c9c9c]">Total: </span>
              <span className="text-white font-medium">{totalHabits}</span>
            </div>
            <div className="bg-[#1f1f1f] px-3 py-1 rounded-full text-xs border border-[#2a2a2a]">
              <span className="text-[#9c9c9c]">Today: </span>
              <span className="text-green-400 font-medium">{habitsCompletedToday}/{totalHabits}</span>
            </div>
            {totalHabits > 0 && (
              <div className="bg-[#1f1f1f] px-3 py-1 rounded-full text-xs border border-[#2a2a2a]">
                <span className="text-[#9c9c9c]">Rate: </span>
                <span className="text-indigo-400 font-medium">
                  {Math.round((habitsCompletedToday / totalHabits) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Habits</option>
            <option value="active">Active Today</option>
            <option value="completed">Completed Today</option>
          </select>

          {/* Add Habit Button */}
          <button
            onClick={() => setShowHabitForm(true)}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Habit
          </button>
        </div>
      </div>

      {/* Grid View - Habit Cards with Circular Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onClick={() => setSelectedHabit(habit)}
            onEdit={(e) => {
              e.stopPropagation()
              setEditingHabit(habit)
            }}
            onDelete={(e) => {
              e.stopPropagation()
              if (window.confirm(`Delete habit "${habit.name}"?`)) {
                deleteHabit(habit.id)
              }
            }}
          />
        ))}
      </div>

      {filteredHabits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#9c9c9c] mb-2">No habits found</p>
          <p className="text-xs text-[#6b6b6b]">Click "New Habit" to start tracking</p>
        </div>
      )}

      {/* Add/Edit Habit Modal */}
      {(showHabitForm || editingHabit) && (
        <HabitForm
          habit={editingHabit}
          onClose={() => {
            setShowHabitForm(false)
            setEditingHabit(null)
          }}
        />
      )}

      {/* Detailed Habit Modal with Heatmap */}
      {selectedHabit && (
        <HabitDetailModal
          habit={selectedHabit}
          onClose={() => setSelectedHabit(null)}
          onEdit={() => {
            setEditingHabit(selectedHabit)
            setSelectedHabit(null)
          }}
        />
      )}
    </div>
  )
}

// Habit Card Component with Circular Progress
function HabitCard({ habit, onClick, onEdit, onDelete }) {
  // Calculate circle properties
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

  const progressColor = getProgressColor()

  return (
    <div 
      onClick={onClick}
      className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg p-5 hover:border-indigo-500/50 hover:bg-[#252525] transition-all group relative cursor-pointer"
    >
      {/* Edit/Delete buttons */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={onEdit} className="p-1.5 bg-[#2a2a2a] rounded-md hover:bg-[#333333]">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button onClick={onDelete} className="p-1.5 bg-[#2a2a2a] rounded-md hover:bg-red-500/20">
          <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Main Content - Flex row with circle and info */}
      <div className="flex items-start gap-4">
        {/* Circular Progress */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          {/* Background circle */}
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#2a2a2a"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
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
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white">{habit.completedDays}</span>
            <span className="text-[10px] text-[#9c9c9c]">/365</span>
          </div>
        </div>

        {/* Habit Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">{habit.name}</h3>
          
          {/* Stats Grid */}
          <div className="mt-3 space-y-2">
            {/* Today's Progress */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9c9c9c]">Today</span>
              <span className={habit.completedToday > 0 ? 'text-green-400 font-medium' : 'text-[#9c9c9c]'}>
                {habit.completedToday}/{habit.totalToday}
              </span>
            </div>
            
            {/* Streak */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9c9c9c] flex items-center gap-1">
                <span>🔥</span> Streak
              </span>
              <span className="text-white font-medium">{habit.streak} days</span>
            </div>
            
            {/* Success Rate */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9c9c9c]">Success Rate</span>
              <span className="text-indigo-400 font-medium">{habit.completionRate}%</span>
            </div>

            {/* Color Indicator */}
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
              <span className="text-[10px] text-[#6b6b6b] truncate">{habit.description || 'No description'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini progress bar for today */}
      {habit.totalToday > 0 && (
        <div className="mt-4">
          <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${habit.progress}%`,
                backgroundColor: habit.color 
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Detailed Habit Modal with GitHub-style Heatmap
function HabitDetailModal({ habit, onClose, onEdit }) {
  // Generate heatmap data for the last 52 weeks
  const heatmapData = useMemo(() => {
    const weeks = []
    const today = new Date()
    
    // Go back 52 weeks
    for (let week = 51; week >= 0; week--) {
      const weekDays = []
      for (let day = 6; day >= 0; day--) {
        const date = new Date(today)
        date.setDate(today.getDate() - (week * 7 + day))
        const dateStr = date.toISOString().split('T')[0]
        const dayData = habit.last365Days.find(d => d.date === dateStr)
        weekDays.push({
          date: dateStr,
          completed: dayData?.completed || false,
          count: dayData?.count || 0
        })
      }
      weeks.push(weekDays)
    }
    return weeks
  }, [habit])

  // Get color intensity based on completion
  const getHeatmapColor = (completed) => {
    if (!completed) return '#1f1f1f' // Dark gray for no activity
    return habit.color // Use habit color for completed days
  }

  // Month labels for X-axis (Feb to Jan as in the image)
  const monthLabels = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#171717] rounded-xl w-full max-w-4xl border border-[#2a2a2a] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
              >
                {habit.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{habit.name}</h2>
                {habit.description && (
                  <p className="text-sm text-[#9c9c9c] mt-1">{habit.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onEdit()
                  onClose()
                }}
                className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 p-6 border-b border-[#2a2a2a]">
          <div className="bg-[#1f1f1f] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{habit.completedDays}</div>
            <div className="text-xs text-[#9c9c9c] mt-1">Total Days</div>
          </div>
          <div className="bg-[#1f1f1f] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{habit.streak}</div>
            <div className="text-xs text-[#9c9c9c] mt-1">Current Streak</div>
          </div>
          <div className="bg-[#1f1f1f] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-400">{habit.completionRate}%</div>
            <div className="text-xs text-[#9c9c9c] mt-1">Success Rate</div>
          </div>
          <div className="bg-[#1f1f1f] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{habit.totalTasks}</div>
            <div className="text-xs text-[#9c9c9c] mt-1">Total Tasks</div>
          </div>
        </div>

        {/* GitHub-style Heatmap */}
        <div className="p-6">
          {/* Contribution settings link */}
          <div className="mb-4">
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              Contribution settings
            </button>
          </div>

          {/* Year navigation */}
          <div className="flex gap-6 mb-6 text-sm">
            <button className="text-white font-medium border-b-2 border-indigo-500 pb-1">2026</button>
            <button className="text-[#9c9c9c] hover:text-white transition-colors">2025</button>
            <button className="text-[#9c9c9c] hover:text-white transition-colors">2024</button>
            <button className="text-[#9c9c9c] hover:text-white transition-colors">2023</button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-225">
              {/* X-axis months (Feb to Jan) */}
              <div className="flex ml-8 mb-2 text-xs text-[#9c9c9c]">
                {monthLabels.map((month, i) => (
                  <div
                    key={i}
                    className="absolute text-xs"
                    style={{ marginLeft: `${i * 64}px` }}
                  >
                    {month}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-1">
                {/* Y-axis day labels (Mon to Fri) */}
                <div className="flex flex-col gap-1 mr-3 text-xs text-[#9c9c9c]">
                  <div className="h-4 flex items-center">Mon</div>
                  <div className="h-4 flex items-center">Wed</div>
                  <div className="h-4 flex items-center">Fri</div>
                </div>

                {/* Heatmap columns (weeks) */}
                <div className="flex gap-1">
                  {heatmapData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className="w-4 h-4 rounded-sm transition-all hover:scale-110 hover:ring-1 hover:ring-white"
                          style={{ 
                            backgroundColor: getHeatmapColor(day.completed),
                            opacity: day.completed ? 1 : 0.5
                          }}
                          title={`${new Date(day.date).toLocaleDateString()}: ${day.completed ? 'Completed' : 'Not completed'}${day.count > 0 ? ` (${day.count} tasks)` : ''}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend and footer */}
              <div className="mt-8 space-y-2">
                {/* Learn how we count contributions */}
                <div className="text-sm">
                  <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    Learn how we count contributions
                  </button>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 text-xs text-[#9c9c9c]">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-sm bg-[#1f1f1f]" />
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: `${habit.color}40` }} />
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: `${habit.color}80` }} />
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: habit.color }} />
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Habit Form Modal
function HabitForm({ habit, onClose }) {
  const { addHabit, updateHabit } = useApp()
  const [name, setName] = useState(habit?.name || "")
  const [description, setDescription] = useState(habit?.description || "")
  const [color, setColor] = useState(habit?.color || "#6366f1")

  const colors = [
    "#6366f1", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"
  ]

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    if (habit) {
      updateHabit(habit.id, { name, description, color })
    } else {
      addHabit({
        id: crypto.randomUUID(),
        name,
        description,
        color,
        createdAt: new Date().toISOString()
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#171717] rounded-xl w-full max-w-md border border-[#2a2a2a]">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {habit ? "Edit Habit" : "Create New Habit"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#9c9c9c] uppercase tracking-wider mb-1 block">
                Habit Name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Morning Meditation"
                className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs text-[#9c9c9c] uppercase tracking-wider mb-1 block">
                Description (Optional)
              </label>
              <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g., 10 minutes of mindfulness"
                className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-[#9c9c9c] uppercase tracking-wider mb-2 block">
                Color
              </label>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`
                      w-8 h-8 rounded-full transition-all
                      ${color === c ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}
                    `}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-[#1f1f1f] text-gray-300 rounded-lg hover:bg-[#262626] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className={`
                  flex-1 px-4 py-2.5 rounded-lg font-medium transition-all
                  ${name.trim()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'bg-[#2a2a2a] text-[#6b6b6b] cursor-not-allowed'
                  }
                `}
              >
                {habit ? "Save Changes" : "Create Habit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Habit