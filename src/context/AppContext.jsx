import { createContext, useContext, useState, useEffect } from "react"
import { seedHabits, seedTasks } from "../data/seedData"

const AppContext = createContext()

export function AppProvider({ children }) {
  /* ---------- DATE ---------- */
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  /* ---------- TASKS with localStorage ---------- */
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      return JSON.parse(savedTasks)
    }
    return seedTasks
  })

  /* ---------- HABITS with localStorage ---------- */
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem("habits")
    if (savedHabits) {
      return JSON.parse(savedHabits)
    }
    return seedHabits
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
          // Merge the existing task with updates, preserving all fields
          return {
            ...task,           // Keep all existing fields
            ...updates,        // Apply updates
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
      ...habit,
      createdAt: new Date().toISOString()
    }
    setHabits(prev => [...prev, newHabit])
  }

  function updateHabit(id, updates) {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id
          ? { ...habit, ...updates }
          : habit
      )
    )
  }

  function deleteHabit(id) {
    setHabits(prev => prev.filter(habit => habit.id !== id))
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

  /* ---------- CONTEXT VALUE ---------- */
  const value = {
    // Date
    selectedDate,
    setSelectedDate,

    // Tasks
    tasks,
    todaysTasks,
    tasksByDate,
    
    // Task functions
    addTask,
    updateTask,
    toggleTask,
    deleteTask,

    // Habits
    habits,
    
    // Habit functions
    addHabit,
    updateHabit,
    deleteHabit,

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

/* ---------- CUSTOM HOOK ---------- */
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}