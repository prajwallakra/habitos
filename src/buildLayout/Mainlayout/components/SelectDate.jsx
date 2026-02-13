import { useState, useRef, useEffect } from "react"

function SelectDate({ baseDate, onSelect, onClose }) {

  const [viewDate, setViewDate] = useState(new Date(baseDate))
  const [mode, setMode] = useState("days")

  const ref = useRef()
  const yearScrollRef = useRef()

  /* close popup when clicking outside */
  useEffect(() => {
    function handleClick(e) {
      if (!ref.current?.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  /* auto scroll active year to center */
  useEffect(() => {
    if (mode === "years" && yearScrollRef.current) {
      const container = yearScrollRef.current
      const active = container.querySelector(".active-year")

      if (active) {
        container.scrollTop =
          active.offsetTop -
          container.clientHeight / 2 +
          active.clientHeight / 2
      }
    }
  }, [mode, viewDate])

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ]

  const weekdays = ["M","T","W","T","F","S","S"]

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  /* calculate month layout */
  const firstDay = new Date(year, month, 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const lastDay = new Date(year, month + 1, 0).getDate()

  const days = [
    ...Array(offset).fill(null),
    ...Array.from({ length: lastDay }, (_, i) => i + 1)
  ]

  /* year list */
  const years = Array.from({ length: 200 }, (_, i) => year - 100 + i)

  const selected = new Date(baseDate)

  /* today checker */
  const today = new Date()
  const isToday = (d) =>
    today.getDate() === d &&
    today.getMonth() === month &&
    today.getFullYear() === year

  /* select day */
  function handlePick(day) {
    const d = new Date(Date.UTC(year, month, day))
    onSelect(d.toISOString().split("T")[0])
  }

  return (
    <div className="absolute top-32 left-1/2 -translate-x-1/2 z-50">

      <div
        ref={ref}
        className="bg-[#171717] border border-[#2a2a2a] rounded-xl p-4 w-80 shadow-lg"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">

          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="hover:text-indigo-400"
          >
            ‹
          </button>

          <div className="flex gap-2 text-sm font-medium">

            <button
              onClick={() => setMode("months")}
              className="hover:text-indigo-400"
            >
              {monthNames[month]}
            </button>

            <button
              onClick={() => setMode("years")}
              className="hover:text-indigo-400"
            >
              {year}
            </button>

          </div>

          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="hover:text-indigo-400"
          >
            ›
          </button>

        </div>

        {/* DAYS VIEW */}
        {mode === "days" && (
          <>
            <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">
              {weekdays.map(d => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm text-center">
              {days.map((day, i) => {
                if (!day) return <div key={i} />

                const isSelected =
                  selected.getDate() === day &&
                  selected.getMonth() === month &&
                  selected.getFullYear() === year

                return (
                  <button
                    key={day}
                    onClick={() => handlePick(day)}
                    className={`
                      p-2 rounded transition
                      ${isSelected
                        ? "bg-indigo-600 text-white"
                        : isToday(day)
                          ? "border border-blue-500"
                          : "hover:bg-indigo-600/80"
                      }
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* MONTH VIEW */}
        {mode === "months" && (
          <div className="grid grid-cols-3 gap-2">
            {monthNames.map((m, i) => (
              <button
                key={m}
                onClick={() => {
                  setViewDate(new Date(year, i, 1))
                  setMode("days")
                }}
                className={`
                  p-3 rounded
                  ${i === month
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-indigo-600/80"
                  }
                `}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* YEAR VIEW */}
        {mode === "years" && (
          <div
            ref={yearScrollRef}
            className="h-60 overflow-y-auto grid grid-cols-4 gap-2"
          >
            {years.map(y => (
              <button
                key={y}
                onClick={() => {
                  setViewDate(new Date(y, month, 1))
                  setMode("days")
                }}
                className={`
                  p-2 rounded
                  ${y === year
                    ? "bg-indigo-600 text-white active-year"
                    : "hover:bg-indigo-600/80"
                  }
                `}
              >
                {y}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default SelectDate
