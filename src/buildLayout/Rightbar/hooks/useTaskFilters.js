import { useMemo } from "react"

export function useTaskFilters({ tasks, selectedDate, filterBy, priorityFilter, statusFilter }) {
  // Get tasks for selected date
  const todaysTasks = useMemo(() => {
    return tasks.filter(task => task.date === selectedDate)
  }, [tasks, selectedDate])
  
  // Apply filters
  const filteredTasks = useMemo(() => {
    return todaysTasks.filter(task => {
      if (filterBy === "priority" && priorityFilter !== "all") {
        return task.priority === priorityFilter
      }
      if (filterBy === "status" && statusFilter !== "all") {
        if (statusFilter === "completed") return task.completed === true
        if (statusFilter === "not-started") return task.status === "not-started" && !task.completed
        if (statusFilter === "ongoing") return task.status === "ongoing" && !task.completed
      }
      return true
    })
  }, [todaysTasks, filterBy, priorityFilter, statusFilter])

  // Group tasks by status
  const tasksByStatus = useMemo(() => ({
    "not-started": todaysTasks.filter(t => !t.completed && t.status === "not-started"),
    "ongoing": todaysTasks.filter(t => !t.completed && t.status === "ongoing"),
    "completed": todaysTasks.filter(t => t.completed === true)
  }), [todaysTasks])

  // Calculate stats
  const stats = useMemo(() => {
    const totalTasks = todaysTasks.length
    const completedTasks = todaysTasks.filter(t => t.completed).length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      totalTasks,
      completedTasks,
      completionRate
    }
  }, [todaysTasks])

  return {
    todaysTasks,
    filteredTasks,
    tasksByStatus,
    stats
  }
}