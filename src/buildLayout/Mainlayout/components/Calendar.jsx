import { useMemo, useState } from "react"
import { useApp } from "../../../context/AppContext"
import SelectDate from "./SelectDate"

function Calendar() {
  const { selectedDate, setSelectedDate } = useApp()

  const [showPicker, setShowPicker] = useState(false)

  const baseDate = new Date(selectedDate)

  const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

  /* generate week */
  const currentWeek = useMemo(() => {

    const day = baseDate.getDay()
    const diff = baseDate.getDate() - (day === 0 ? 6 : day - 1)

    const monday = new Date(baseDate.setDate(diff))

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)

      return d.toISOString().split("T")[0]
    })

  }, [selectedDate])

  /* week nav */
  function changeWeek(offset) {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + offset * 7)
    setSelectedDate(d.toISOString().split("T")[0])
  }

  const label = new Date(selectedDate)
    .toLocaleString("default", { month: "short", year: "numeric" })

  return (
    <section className="relative bg-[#171717] border border-[#2a2a2a] rounded-xl p-6 mb-6">

      <h2 className="text-lg font-semibold mb-4">Calendar</h2>

      {/* WEEK GRID */}
      <div className="grid grid-cols-7 gap-3 mb-4">

        {currentWeek.map((date, i) => {

          const d = new Date(date)
          const isSelected = date === selectedDate

          return (
            <div
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`
                h-32 rounded-lg border cursor-pointer
                flex flex-col items-center pt-3

                ${isSelected
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-[#1f1f1f] border-[#2a2a2a] hover:border-indigo-500 text-gray-400"
                }
              `}
            >
              <span className="text-xs">{weekDays[i]}</span>
              <span className="text-xl font-semibold mt-1">
                {d.getDate()}
              </span>
            </div>
          )
        })}
      </div>

      {/* CONTROLS */}
      <div className="flex justify-between">

        <button onClick={() => changeWeek(-1)}>
          ←
        </button>

        <button onClick={() => setShowPicker(true)}>
          {label}
        </button>

        <button onClick={() => changeWeek(1)}>
          →
        </button>

      </div>

      {/* POPUP */}
      {showPicker && (
        <SelectDate
          baseDate={selectedDate}
          onSelect={(date) => setSelectedDate(date)}
          onClose={() => setShowPicker(false)}
        />
      )}

    </section>
  )
}

export default Calendar
