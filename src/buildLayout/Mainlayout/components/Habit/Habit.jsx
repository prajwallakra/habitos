import { useState } from "react"
import { useApp } from "../../../../context/AppContext"
import { useHabitData } from "./hooks/useHabitData"
import HabitStats from "./HabitStats"
import HabitFilters from "./HabitFilters"
import HabitCard from "./HabitCard"
import HabitDetailModal from "./HabitDetailModal"
import HabitForm from "./HabitForm"

function Habit() {
  const { deleteHabit } = useApp()
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [filter, setFilter] = useState("all")

  const { stats, habitsWithData } = useHabitData()

  const filteredHabits = habitsWithData.filter(habit => {
    if (filter === "active") return habit.totalToday > 0
    if (filter === "completed") return habit.completedToday > 0
    return true
  })

  const handleDelete = (habit, e) => {
    e.stopPropagation()
    if (window.confirm(`Delete habit "${habit.name}"?`)) {
      deleteHabit(habit.id)
    }
  }

  const handleEdit = (habit, e) => {
    e.stopPropagation()
    setEditingHabit(habit)
  }

  return (
    <div className="bg-(--bg-card) border border-(--border) rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <HabitStats
          totalHabits={stats.totalHabits}
          completedToday={stats.habitsCompletedToday}
          completionRate={stats.completionRate}
        />

        <HabitFilters
          filter={filter}
          onFilterChange={setFilter}
          onAddHabit={() => setShowHabitForm(true)}
        />
      </div>

      {/* Habit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onClick={() => setSelectedHabit(habit)}
            onEdit={(e) => handleEdit(habit, e)}
            onDelete={(e) => handleDelete(habit, e)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredHabits.length === 0 && <EmptyState />}

      {/* Modals */}
      {(showHabitForm || editingHabit) && (
        <HabitForm
          habit={editingHabit}
          onClose={() => {
            setShowHabitForm(false)
            setEditingHabit(null)
          }}
        />
      )}

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

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg
          className="w-16 h-16 mx-auto text-(--text-secondary)"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <p className="text-(--text-secondary) mb-2">
        No habits found
      </p>

      <p className="text-xs text-(--text-secondary) opacity-70">
        Click "New Habit" to start tracking your daily routines
      </p>
    </div>
  )
}

export default Habit