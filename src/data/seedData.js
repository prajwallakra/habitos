export const seedHabits = [
  { id: "h1", name: "Study", color: "#6366f1" },
  { id: "h2", name: "Workout", color: "#22c55e" },
  { id: "h3", name: "Reading", color: "#f59e0b" }
]

export const seedTasks = [
  {
    id: "t1",
    title: "Solve DSA problems",
    date: new Date().toISOString().split("T")[0],
    habitId: "h1",
    priority: "high",
    note: "Focus on graphs",
    completed: false
  }
]
