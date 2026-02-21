import { createContext, useContext, useState, useEffect } from "react"

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
      // Ensure all habits have targetDays (for backward compatibility)
      return parsedHabits.map(habit => ({
        ...habit,
        targetDays: habit.targetDays || 365 // Default to 365 if not set
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
  function addTask(task) {
    const newTask = {
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTasks(prev => [...prev, newTask])
  }

  function updateTask(id, updates) {
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
  }

  function toggleTask(id) {
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
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  /* ---------- HABIT FUNCTIONS ---------- */
  function addHabit(habit) {
    const newHabit = {
      id: habit.id || crypto.randomUUID(),
      name: habit.name,
      description: habit.description || "",
      color: habit.color || "#6366f1",
      targetDays: habit.targetDays || 365, // Ensure targetDays is set
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setHabits(prev => [...prev, newHabit])
  }

  function updateHabit(id, updates) {
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
  }

  function deleteHabit(id) {
    setHabits(prev => prev.filter(habit => habit.id !== id))
  }

  /* ---------- HELPER FUNCTIONS ---------- */
  function getHabitById(id) {
    return habits.find(habit => habit.id === id)
  }

  function getTasksByHabit(habitId) {
    return tasks.filter(task => task.habitId === habitId)
  }

  function getHabitStats(habitId) {
    const habitTasks = tasks.filter(task => task.habitId === habitId)
    const completedTasks = habitTasks.filter(t => t.completed).length
    const totalTasks = habitTasks.length
    
    // Calculate streak
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
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
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }
  }

  /* ---------- NOTES FUNCTIONS ---------- */
  function updateNotes(value) {
    setNotes(value)
  }

  /* ---------- FILTERED DATA ---------- */
  const todaysTasks = tasks.filter(task => task.date === selectedDate)

  const tasksByDate = (date) => {
    return tasks.filter(task => task.date === date)
  }

  const completedTasksCount = tasks.filter(t => t.completed).length
  const totalTasksCount = tasks.length
  const completionRate = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0

  // Habits with their associated tasks
  const habitsWithTasks = habits.map(habit => ({
    ...habit,
    tasks: tasks.filter(task => task.habitId === habit.id),
    stats: getHabitStats(habit.id)
  }))

  /* ---------- CONTEXT VALUE ---------- */
  const value = {
    // Date
    selectedDate,
    setSelectedDate,
    
    // Tasks
    tasks,
    todaysTasks,
    tasksByDate,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    
    // Habits
    habits,
    habitsWithTasks,
    addHabit,
    updateHabit,
    deleteHabit,
    getHabitById,
    getTasksByHabit,
    getHabitStats,
    
    // Notes
    notes,
    updateNotes,
    
    // Stats
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