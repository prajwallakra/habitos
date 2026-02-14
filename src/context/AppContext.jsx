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

  /* ---------- HABIT TRACKING ---------- */
  const [habitCompletions, setHabitCompletions] = useState(() => {
    const savedCompletions = localStorage.getItem("habitCompletions")
    if (savedCompletions) {
      return JSON.parse(savedCompletions)
    }
    // Initialize empty habit completions
    return {}
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

  useEffect(() => {
    localStorage.setItem("habitCompletions", JSON.stringify(habitCompletions))
  }, [habitCompletions])

  /* ---------- TASK FUNCTIONS ---------- */
  function addTask(task) {
    const newTask = {
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTasks(prev => [...prev, newTask])
    
    // If task is associated with a habit, update habit stats
    if (task.habitId) {
      updateHabitStats(task.habitId)
    }
  }

  function updateTask(id, updates) {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString()
          }
          
          // If habitId changed or completion status changed, update habit stats
          if (task.habitId !== updatedTask.habitId || 
              task.completed !== updatedTask.completed) {
            // Update old habit stats if it existed
            if (task.habitId) {
              updateHabitStats(task.habitId)
            }
            // Update new habit stats if it exists
            if (updatedTask.habitId) {
              updateHabitStats(updatedTask.habitId)
            }
          }
          
          return updatedTask
        }
        return task
      })
    )
  }

  function toggleTask(id) {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const toggledTask = {
            ...task,
            completed: !task.completed,
            status: !task.completed ? "completed" : task.status || "not-started",
            updatedAt: new Date().toISOString()
          }
          
          // Update habit stats if task is associated with a habit
          if (task.habitId) {
            updateHabitStats(task.habitId)
          }
          
          return toggledTask
        }
        return task
      })
    )
  }

  function deleteTask(id) {
    const taskToDelete = tasks.find(t => t.id === id)
    setTasks(prev => prev.filter(task => task.id !== id))
    
    // Update habit stats if task was associated with a habit
    if (taskToDelete?.habitId) {
      updateHabitStats(taskToDelete.habitId)
    }
  }

  /* ---------- HABIT FUNCTIONS ---------- */
  function addHabit(habit) {
    const newHabit = {
      id: habit.id || crypto.randomUUID(),
      name: habit.name,
      color: habit.color || "#6366f1",
      description: habit.description || "",
      frequency: habit.frequency || "daily", // daily, weekly, monthly
      target: habit.target || 1, // number of times per frequency
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setHabits(prev => [...prev, newHabit])
    
    // Initialize habit completions for this habit
    setHabitCompletions(prev => ({
      ...prev,
      [newHabit.id]: {
        total: 0,
        byDate: {},
        streak: 0,
        lastCompleted: null
      }
    }))
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
    // Check if habit is in use
    const tasksUsingHabit = tasks.filter(task => task.habitId === id)
    if (tasksUsingHabit.length > 0) {
      if (!window.confirm(`This habit is used by ${tasksUsingHabit.length} tasks. Delete anyway?`)) {
        return
      }
      // Remove habitId from associated tasks
      setTasks(prev =>
        prev.map(task =>
          task.habitId === id
            ? { ...task, habitId: null }
            : task
        )
      )
    }
    
    setHabits(prev => prev.filter(habit => habit.id !== id))
    
    // Remove habit completions
    setHabitCompletions(prev => {
      const { [id]: removed, ...rest } = prev
      return rest
    })
  }

  /* ---------- HABIT STATS FUNCTIONS ---------- */
  function updateHabitStats(habitId) {
    if (!habitId) return
    
    const habitTasks = tasks.filter(task => task.habitId === habitId)
    const completedTasks = habitTasks.filter(t => t.completed)
    
    // Calculate streak
    let streak = 0
    const dates = completedTasks.map(t => t.date).sort()
    if (dates.length > 0) {
      const today = new Date().toISOString().split('T')[0]
      const lastDate = dates[dates.length - 1]
      
      if (lastDate === today) {
        streak = 1
        // Check previous days
        let checkDate = new Date(today)
        for (let i = 1; i < 30; i++) {
          checkDate.setDate(checkDate.getDate() - 1)
          const dateStr = checkDate.toISOString().split('T')[0]
          if (dates.includes(dateStr)) {
            streak++
          } else {
            break
          }
        }
      }
    }
    
    setHabitCompletions(prev => ({
      ...prev,
      [habitId]: {
        total: completedTasks.length,
        byDate: completedTasks.reduce((acc, task) => {
          acc[task.date] = (acc[task.date] || 0) + 1
          return acc
        }, {}),
        streak,
        lastCompleted: completedTasks.length > 0 
          ? completedTasks.sort((a, b) => b.date.localeCompare(a.date))[0].date
          : null
      }
    }))
  }

  function getHabitStats(habitId) {
    return habitCompletions[habitId] || {
      total: 0,
      byDate: {},
      streak: 0,
      lastCompleted: null
    }
  }

  function getHabitCompletionForDate(habitId, date) {
    const stats = habitCompletions[habitId]
    return stats?.byDate[date] || 0
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

  const tasksByHabit = (habitId) => {
    return tasks.filter(task => task.habitId === habitId)
  }

  const completedTasksCount = tasks.filter(t => t.completed).length
  const totalTasksCount = tasks.length
  const completionRate = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0

  // Habits with stats
  const habitsWithStats = habits.map(habit => ({
    ...habit,
    stats: getHabitStats(habit.id),
    taskCount: tasks.filter(t => t.habitId === habit.id).length,
    completedTaskCount: tasks.filter(t => t.habitId === habit.id && t.completed).length,
    completionRate: tasks.filter(t => t.habitId === habit.id).length > 0
      ? Math.round((tasks.filter(t => t.habitId === habit.id && t.completed).length / 
                   tasks.filter(t => t.habitId === habit.id).length) * 100)
      : 0
  }))

  // Today's habits completion
  const todaysHabitCompletions = habits.map(habit => ({
    ...habit,
    completed: getHabitCompletionForDate(habit.id, selectedDate) > 0,
    count: getHabitCompletionForDate(habit.id, selectedDate)
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
    tasksByHabit,
    
    // Task functions
    addTask,
    updateTask,
    toggleTask,
    deleteTask,

    // Habits
    habits,
    habitsWithStats,
    todaysHabitCompletions,
    
    // Habit functions
    addHabit,
    updateHabit,
    deleteHabit,
    getHabitStats,
    getHabitCompletionForDate,

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