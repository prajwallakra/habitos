import { createContext, useContext, useState } from "react"
import { seedHabits, seedTasks } from "../data/seedData"

const AppContext = createContext()

export function AppProvider({ children }) {

  /*  DATE */
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )


  /* TASKS */
  const [tasks, setTasks] = useState(seedTasks)


  function addTask(task) {
    setTasks(prev => [...prev, task])
  }

  function toggleTask(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id))
  }


  /* HABITS  */
  const [habits, setHabits] = useState(seedHabits)

  function addHabit(habit) {
    setHabits(prev => [...prev, habit])
  }


  /* NOTES  */
  const [notes, setNotes] = useState("")

  function updateNotes(value) {
    setNotes(value)
  }


  /* FILTERED DATA */

  const todaysTasks = tasks.filter(
    task => task.date === selectedDate
  )


  /* EXPORT */

  const value = {
    selectedDate,
    setSelectedDate,

    tasks,
    todaysTasks,

    habits,

    notes,
    updateNotes,

    addTask,
    toggleTask,
    deleteTask,
    addHabit
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}


/* CUSTOM HOOK- */

export function useApp() {
  return useContext(AppContext)
}
