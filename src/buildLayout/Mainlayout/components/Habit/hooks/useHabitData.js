import { useMemo } from "react"
import { useApp } from "../../../../../context/AppContext"

export function useHabitData() {
  const { habits, tasks } = useApp()
  const today = new Date().toISOString().split('T')[0]

  // Use useMemo with proper dependencies
  const stats = useMemo(() => {
    console.log("Recalculating habit stats...") 
    const totalHabits = habits.length
    const habitsCompletedToday = habits.filter(habit => {
      const habitTasks = tasks.filter(t => t.habitId === habit.id && t.date === today)
      return habitTasks.some(t => t.completed)
    }).length

    return {
      totalHabits,
      habitsCompletedToday,
      completionRate: totalHabits > 0 ? Math.round((habitsCompletedToday / totalHabits) * 100) : 0
    }
  }, [habits, tasks, today]) // Dependencies ensure recalculation when tasks change

  const habitsWithData = useMemo(() => {
    console.log("Recalculating habits with data...") // Debug log
    return habits.map(habit => {
      const habitTasks = tasks.filter(t => t.habitId === habit.id)
      const todayTasks = habitTasks.filter(t => t.date === today)
      const targetDays = habit.targetDays || 365
      
      const lastTargetDays = Array.from({ length: targetDays }, (_, i) => {
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

      const completedDays = lastTargetDays.filter(d => d.completed).length
      const completionRate = Math.round((completedDays / targetDays) * 100)

      return {
        ...habit,
        targetDays,
        todayTasks,
        completedToday: todayTasks.filter(t => t.completed).length,
        totalToday: todayTasks.length,
        progress: todayTasks.length > 0 ? (todayTasks.filter(t => t.completed).length / todayTasks.length) * 100 : 0,
        streak,
        completedDays,
        completionRate,
        totalTasks: habitTasks.length,
        completedTasks: habitTasks.filter(t => t.completed).length,
        lastTargetDays
      }
    })
  }, [habits, tasks, today]) // Dependencies ensure recalculation when tasks change

  return {
    stats,
    habitsWithData,
    today
  }
}