import { useMemo } from "react"

function HabitDetailModal({ habit, onClose, onEdit }) {
  const heatmapData = useMemo(() => generateHeatmapData(habit), [habit])
  const monthLabels = ['Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb']

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-(--bg-card) rounded-xl w-full max-w-4xl border border-(--border) max-h-[90vh] overflow-y-auto"
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

/* ================= DATA ================= */

function generateHeatmapData(habit) {
  const weeks = []
  const today = new Date()

  for (let week = 51; week >= 0; week--) {
    const weekDays = []
    for (let day = 6; day >= 0; day--) {
      const date = new Date(today)
      date.setDate(today.getDate() - (week * 7 + day))
      const dateStr = date.toISOString().split('T')[0]
      const dayData =
        habit.lastTargetDays?.find(d => d.date === dateStr) || {
          completed: false,
          count: 0,
        }

      weekDays.push({
        date: dateStr,
        completed: dayData.completed,
        count: dayData.count,
      })
    }
    weeks.push(weekDays)
  }
  return weeks
}

/* ================= HEADER ================= */

function ModalHeader({ habit, onClose, onEdit }) {
  return (
    <div className="p-6 border-b border-(--border)">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
            style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
          >
            {habit.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-(--text-primary)">
              {habit.name}
            </h2>
            {habit.description && (
              <p className="text-sm text-(--text-secondary) mt-1">
                {habit.description}
              </p>
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

/* ================= STATS ================= */

function StatsOverview({ habit }) {
  const targetDisplay =
    habit.targetDays === 365 ? "Year" :
    habit.targetDays === 730 ? "2 Years" :
    habit.targetDays === 1095 ? "3 Years" :
    `${habit.targetDays} Days`

  const stats = [
    { label: 'Completed', value: habit.completedDays, color: 'text-(--text-primary)' },
    { label: 'Target', value: targetDisplay, color: 'text-blue-400' },
    { label: 'Current Streak', value: habit.streak, color: 'text-green-400' },
    { label: 'Success Rate', value: `${habit.completionRate}%`, color: 'text-indigo-400' },
    { label: 'Total Tasks', value: habit.totalTasks, color: 'text-(--text-primary)' }
  ]

  return (
    <div className="grid grid-cols-5 gap-4 p-6 border-b border-(--border)">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-(--bg-hover) rounded-lg p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-(--text-secondary) mt-1">{label}</div>
    </div>
  )
}

/* ================= HEATMAP ================= */

function HeatmapSection({ habit, heatmapData, monthLabels }) {
  return (
    <div className="p-6">
      <ContributionSettings />
      <YearNavigation />

      <div className="overflow-x-auto">
        <XAxisLabels labels={monthLabels} />

        <div className="flex gap-1">
          <YAxisLabels />
          <HeatmapGrid heatmapData={heatmapData} habitColor={habit.color} />
        </div>

        <LegendFooter habitColor={habit.color} />
      </div>
    </div>
  )
}

function ContributionSettings() {
  return (
    <div className="mb-4">
      <button className="text-sm text-indigo-400 hover:text-indigo-300">
        Contribution settings
      </button>
    </div>
  )
}

function YearNavigation() {
  const years = ['2026','2025','2024','2023']
  return (
    <div className="flex gap-6 mb-6 text-sm">
      {years.map((year,i)=>(
        <button
          key={year}
          className={
            i===0
              ? "text-(--text-primary) font-medium border-b-2 border-indigo-500 pb-1"
              : "text-(--text-secondary) hover:text-(--text-primary)"
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
    <div className="flex ml-8 mb-2 text-xs text-(--text-secondary)">
      {labels.map((m,i)=>(
        <div key={i} className="absolute text-xs" style={{marginLeft:`${i*64}px`}}>
          {m}
        </div>
      ))}
    </div>
  )
}

function YAxisLabels() {
  const days=['Mon','Wed','Fri']
  return (
    <div className="flex flex-col gap-1 mr-3 text-xs text-(--text-secondary)">
      {days.map(d=>(
        <div key={d} className="h-4 flex items-center">{d}</div>
      ))}
    </div>
  )
}

function HeatmapGrid({ heatmapData, habitColor }) {
  const getHeatmapColor = (completed) =>
    completed ? habitColor : "var(--bg-hover)"

  return (
    <div className="flex gap-1">
      {heatmapData.map((week,w)=>(
        <div key={w} className="flex flex-col gap-1">
          {week.map((day,d)=>(
            <div
              key={`${w}-${d}`}
              className="w-4 h-4 rounded-sm transition-all hover:scale-110 hover:ring-1 hover:ring-white"
              style={{
                backgroundColor:getHeatmapColor(day.completed),
                opacity:day.completed?1:0.5
              }}
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
      <button className="text-indigo-400 hover:text-indigo-300 text-sm">
        Learn how we count contributions
      </button>

      <div className="flex items-center gap-2 text-xs text-(--text-secondary)">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-(--bg-hover)" />
          <div className="w-4 h-4 rounded-sm" style={{backgroundColor:`${habitColor}40`}}/>
          <div className="w-4 h-4 rounded-sm" style={{backgroundColor:`${habitColor}80`}}/>
          <div className="w-4 h-4 rounded-sm" style={{backgroundColor:habitColor}}/>
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

/* ================= BUTTONS ================= */

function IconButton({ onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-(--bg-hover) rounded-lg transition-colors"
    >
      {icon}
    </button>
  )
}

function EditIcon() {
  return (
    <svg className="w-5 h-5 text-(--text-secondary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5 text-(--text-secondary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default HabitDetailModal