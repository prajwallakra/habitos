import { useMemo } from "react"

function HabitDetailModal({ habit, onClose, onEdit }) {
  const heatmapData = useMemo(() => generateHeatmapData(habit), [habit])
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
        <ModalHeader habit={habit} onClose={onClose} onEdit={onEdit} />
        <StatsOverview habit={habit} />
        <HeatmapSection 
          habit={habit}
          heatmapData={heatmapData}
          monthLabels={monthLabels}
        />
      </div>
    </div>
  )
}

// Helper function to generate heatmap data
function generateHeatmapData(habit) {
  const weeks = []
  const today = new Date()
  
  for (let week = 51; week >= 0; week--) {
    const weekDays = []
    for (let day = 6; day >= 0; day--) {
      const date = new Date(today)
      date.setDate(today.getDate() - (week * 7 + day))
      const dateStr = date.toISOString().split('T')[0]
      const dayData = habit.lastTargetDays?.find(d => d.date === dateStr) || { completed: false, count: 0 }
      weekDays.push({
        date: dateStr,
        completed: dayData.completed,
        count: dayData.count
      })
    }
    weeks.push(weekDays)
  }
  return weeks
}

// Sub-components
function ModalHeader({ habit, onClose, onEdit }) {
  return (
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
          <IconButton onClick={() => { onEdit(); onClose(); }} icon={<EditIcon />} />
          <IconButton onClick={onClose} icon={<CloseIcon />} />
        </div>
      </div>
    </div>
  )
}

function StatsOverview({ habit }) {
  const targetDisplay = habit.targetDays === 365 ? "Year" : 
                        habit.targetDays === 730 ? "2 Years" :
                        habit.targetDays === 1095 ? "3 Years" :
                        `${habit.targetDays} Days`

  const stats = [
    { label: 'Completed', value: habit.completedDays, color: 'text-white' },
    { label: 'Target', value: targetDisplay, color: 'text-blue-400' },
    { label: 'Current Streak', value: habit.streak, color: 'text-green-400' },
    { label: 'Success Rate', value: `${habit.completionRate}%`, color: 'text-indigo-400' },
    { label: 'Total Tasks', value: habit.totalTasks, color: 'text-white' }
  ]

  return (
    <div className="grid grid-cols-5 gap-4 p-6 border-b border-[#2a2a2a]">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#1f1f1f] rounded-lg p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-[#9c9c9c] mt-1">{label}</div>
    </div>
  )
}

function HeatmapSection({ habit, heatmapData, monthLabels }) {
  return (
    <div className="p-6">
      <ContributionSettings />
      <YearNavigation />
      
      <div className="overflow-x-auto">
        <div className="w-full">
          <XAxisLabels labels={monthLabels} />
          
          <div className="flex gap-1">
            <YAxisLabels />
            <HeatmapGrid heatmapData={heatmapData} habitColor={habit.color} />
          </div>

          <LegendFooter habitColor={habit.color} />
        </div>
      </div>
    </div>
  )
}

function ContributionSettings() {
  return (
    <div className="mb-4">
      <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
        Contribution settings
      </button>
    </div>
  )
}

function YearNavigation() {
  const years = ['2026', '2025', '2024', '2023']
  return (
    <div className="flex gap-6 mb-6 text-sm">
      {years.map((year, index) => (
        <button
          key={year}
          className={index === 0 
            ? 'text-white font-medium border-b-2 border-indigo-500 pb-1' 
            : 'text-[#9c9c9c] hover:text-white transition-colors'
          }
        >
          {year}
        </button>
      ))}
    </div>
  )
}

function XAxisLabels({ labels }) {
  return (
    <div className="flex ml-8 mb-2 text-xs text-[#9c9c9c]">
      {labels.map((month, i) => (
        <div
          key={i}
          className="absolute text-xs"
          style={{ marginLeft: `${i * 64}px` }}
        >
          {month}
        </div>
      ))}
    </div>
  )
}

function YAxisLabels() {
  const days = ['Mon', 'Wed', 'Fri']
  return (
    <div className="flex flex-col gap-1 mr-3 text-xs text-[#9c9c9c]">
      {days.map(day => (
        <div key={day} className="h-4 flex items-center">{day}</div>
      ))}
    </div>
  )
}

function HeatmapGrid({ heatmapData, habitColor }) {
  const getHeatmapColor = (completed) => {
    if (!completed) return '#1f1f1f'
    return habitColor
  }

  return (
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
  )
}

function LegendFooter({ habitColor }) {
  return (
    <div className="mt-8 space-y-2">
      <div className="text-sm">
        <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
          Learn how we count contributions
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-[#9c9c9c]">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-[#1f1f1f]" />
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: `${habitColor}40` }} />
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: `${habitColor}80` }} />
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: habitColor }} />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

// Utility Components
function IconButton({ onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
    >
      {icon}
    </button>
  )
}

function EditIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default HabitDetailModal