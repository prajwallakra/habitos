import { useMemo, useState } from "react"
import { useApp } from "../../../../context/AppContext"
import SelectDate from "./SelectDate"
import AddTaskModal from "./AddTaskModal"
import ShowTasks from "./ShowTasks"

function Calendar() {
  const { selectedDate, setSelectedDate } = useApp()

  const [showPicker, setShowPicker] = useState(false)
  const [taskDate, setTaskDate] = useState(null)
  const [editingTask, setEditingTask] = useState(null) // New state for editing

  const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

  const baseDate = new Date(selectedDate)

  /* ---------- generate week safely ---------- */
  const currentWeek = useMemo(() => {
    const base = new Date(baseDate)
    const day = base.getDay()

    const diff = base.getDate() - (day === 0 ? 6 : day - 1)
    const monday = new Date(base)
    monday.setDate(diff)

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d.toISOString().split("T")[0]
    })
  }, [selectedDate])

  /* ---------- week navigation ---------- */
  function changeWeek(offset) {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + offset * 7)
    setSelectedDate(d.toISOString().split("T")[0])
  }

  /* ---------- handle task click for editing ---------- */
  function handleTaskClick(task) {
    setEditingTask(task)
  }

  /* ---------- close modal ---------- */
  function handleCloseModal() {
    setTaskDate(null)
    setEditingTask(null)
  }

  /* ---------- label ---------- */
  const label = new Date(selectedDate)
    .toLocaleString("default", { month: "short", year: "numeric" })

  const todayString = new Date().toISOString().split("T")[0]

  return (
    <section className="relative bg-[#171717] border border-[#2a2a2a] rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Calendar</h2>

      {/* WEEK GRID */}
      <div className="grid grid-cols-7 gap-3 mb-4">
        {currentWeek.map((date, i) => {
          const d = new Date(date)
          const isSelected = date === selectedDate
          const isToday = date === todayString

          return (
            <div
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`
                group relative h-48 rounded-lg cursor-pointer
                flex flex-col pt-3 transition-all duration-200
                ${isSelected
                  ? "bg-indigo-600/20 ring-2 ring-indigo-500"
                  : "bg-[#1f1f1f] hover:bg-[#252525]"
                }
              `}
            >
              {/* Day Header */}
              <div className="px-3 flex items-center justify-between">
                {/* Day and Date with Today highlight */}
                <div className={`
                  ${isToday && !isSelected ? 'bg-blue-500/20 rounded-lg px-2 py-1 -ml-2' : ''}
                `}>
                  <span className="text-xs text-gray-400">{weekDays[i]}</span>
                  <span className="text-xl font-semibold ml-2 text-white">
                    {d.getDate()}
                  </span>
                </div>
                
                {/* Task Counter */}
                <ShowTasks date={date} mode="counter" />
              </div>

              {/* Tasks List - Pass onTaskClick prop */}
              <div className="flex-1 overflow-y-auto mt-2 px-2 space-y-1.5 custom-scrollbar">
                <ShowTasks 
                  date={date} 
                  mode="list" 
                  onTaskClick={handleTaskClick}
                />
              </div>

              {/* ADD TASK BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setTaskDate(date)
                }}
                className="
                  absolute bottom-2 right-2 opacity-0 group-hover:opacity-100
                  transition text-sm w-7 h-7 rounded-full
                  bg-indigo-600 hover:bg-indigo-500
                  flex items-center justify-center shadow-lg
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {/* CONTROLS */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => changeWeek(-1)}
          className="px-4 py-2 bg-[#1f1f1f] rounded-lg hover:bg-[#262626] transition-colors"
        >
          ←
        </button>

        <button
          onClick={() => setShowPicker(true)}
          className="font-medium hover:text-indigo-400 transition-colors"
        >
          {label}
        </button>

        <button
          onClick={() => changeWeek(1)}
          className="px-4 py-2 bg-[#1f1f1f] rounded-lg hover:bg-[#262626] transition-colors"
        >
          →
        </button>
      </div>

      {/* DATE PICKER */}
      {showPicker && (
        <SelectDate
          baseDate={selectedDate}
          onSelect={(date) => setSelectedDate(date)}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* TASK MODAL - For both creating and editing */}
      {(taskDate || editingTask) && (
        <AddTaskModal
          date={taskDate || editingTask?.date}
          taskToEdit={editingTask}
          onClose={handleCloseModal}
        />
      )}
    </section>
  )
}

export default Calendar