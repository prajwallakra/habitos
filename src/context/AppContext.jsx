import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

const AppContext = createContext()

export function AppProvider({ children }) {
  /* ---------- DATE ---------- */
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  /* ---------- TASKS with localStorage ---------- */
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks")
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  /* ---------- HABITS with localStorage ---------- */
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem("habits")
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits)
      return parsedHabits.map(habit => ({
        ...habit,
        targetDays: habit.targetDays || 365
      }))
    }
    return []
  })

  /* ---------- NOTES with localStorage ---------- */
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes")
    return savedNotes ? JSON.parse(savedNotes) : ""
  })

  /* ---------- Save to localStorage on changes ---------- */
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  /* ---------- TASK FUNCTIONS ---------- */
  const addTask = useCallback((task) => {
    const newTask = {
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTasks(prev => [...prev, newTask])
  }, [])

  const updateTask = useCallback((id, updates) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          return {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
        return task
      })
    )
  }, [])

  const toggleTask = useCallback((id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? "completed" : task.status,
              updatedAt: new Date().toISOString()
            }
          : task
      )
    )
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  /* ---------- HABIT FUNCTIONS ---------- */
  const addHabit = useCallback((habit) => {
    const newHabit = {
      id: habit.id || crypto.randomUUID(),
      name: habit.name,
      description: habit.description || "",
      color: habit.color || "#6366f1",
      targetDays: habit.targetDays || 365,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setHabits(prev => [...prev, newHabit])
  }, [])

  const updateHabit = useCallback((id, updates) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id
          ? {
              ...habit,
              ...updates,
              updatedAt: new Date().toISOString()
            }
          : habit
      )
    )
  }, [])

  const deleteHabit = useCallback((id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id))
  }, [])

  /* ---------- NOTES FUNCTIONS ---------- */
  const updateNotes = useCallback((value) => {
    setNotes(value)
  }, [])

  /* ---------- FILTERED DATA ---------- */
  const todaysTasks = tasks.filter(task => task.date === selectedDate)

  const tasksByDate = useCallback((date) => {
    return tasks.filter(task => task.date === date)
  }, [tasks])

  const completedTasksCount = tasks.filter(t => t.completed).length
  const totalTasksCount = tasks.length
  const completionRate =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0

  const getHabitById = useCallback((id) => {
    return habits.find(habit => habit.id === id)
  }, [habits])

  const getTasksByHabit = useCallback((habitId) => {
    return tasks.filter(task => task.habitId === habitId)
  }, [tasks])

  const getHabitStats = useCallback((habitId) => {
    const habitTasks = tasks.filter(task => task.habitId === habitId)
    const completedTasks = habitTasks.filter(t => t.completed).length
    const totalTasks = habitTasks.length

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

    return {
      totalTasks,
      completedTasks,
      streak,
      completionRate:
        totalTasks > 0
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0
    }
  }, [tasks])

  const habitsWithTasks = useMemo(() => {
    return habits.map(habit => ({
      ...habit,
      tasks: tasks.filter(task => task.habitId === habit.id),
      stats: getHabitStats(habit.id)
    }))
  }, [habits, tasks, getHabitStats])

  const value = {
    selectedDate,
    setSelectedDate,
    tasks,
    todaysTasks,
    tasksByDate,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    habits,
    habitsWithTasks,
    addHabit,
    updateHabit,
    deleteHabit,
    getHabitById,
    getTasksByHabit,
    getHabitStats,
    notes,
    updateNotes,
    completedTasksCount,
    totalTasksCount,
    completionRate
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}