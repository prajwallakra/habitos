import { useState } from "react"
import { useApp } from "../../context/AppContext"
import Header from "./components/Header"
import FilterTabs from "./components/FilterTabs"
import TaskSection from "./components/TaskSection"
import NotesSection from "./components/NotesSection"
import { useTaskFilters } from "./hooks/useTaskFilters"

function Rightbar() {
  const { selectedDate, tasks, notes, updateNotes, updateTask } = useApp()

  const [filterBy, setFilterBy] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isNotesFocused, setIsNotesFocused] = useState(false)

  const { todaysTasks, filteredTasks, tasksByStatus, stats } =
    useTaskFilters({
      tasks,
      selectedDate,
      filterBy,
      priorityFilter,
      statusFilter,
    })

  function toggleTaskCompletion(taskId, e) {
    e.stopPropagation()

    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      const newCompleted = !task.completed
      updateTask(taskId, {
        completed: newCompleted,
        status: newCompleted ? "completed" : "not-started",
      })
    }
  }

  return (
    <aside
      className="
        h-screen w-[320px]
        bg-(--bg-card)
        border-l border-(--border)
        flex flex-col
        text-(--text-primary)
      "
    >
      <Header
        selectedDate={selectedDate}
        totalTasks={stats.totalTasks}
        completedTasks={stats.completedTasks}
        completionRate={stats.completionRate}
      />

      <FilterTabs
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <TaskSection
        filterBy={filterBy}
        priorityFilter={priorityFilter}
        statusFilter={statusFilter}
        todaysTasks={todaysTasks}
        filteredTasks={filteredTasks}
        tasksByStatus={tasksByStatus}
        onToggleComplete={toggleTaskCompletion}
      />

      <NotesSection
        notes={notes}
        updateNotes={updateNotes}
        isNotesFocused={isNotesFocused}
        setIsNotesFocused={setIsNotesFocused}
      />
    </aside>
  )
}

export default Rightbar