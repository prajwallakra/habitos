import { useState, useRef, useEffect } from "react"

function SelectDate({ baseDate, onSelect, onClose }) {
  const [viewDate, setViewDate] = useState(new Date(baseDate))
  const [mode, setMode] = useState("days")

  const ref = useRef()
  const yearScrollRef = useRef()

  /* ---------- close popup on outside click ---------- */
  useEffect(() => {
    function handleClick(e) {
      if (!ref.current?.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  /* ---------- center current year ---------- */
  useEffect(() => {
    if (mode === "years" && yearScrollRef.current) {
      const container = yearScrollRef.current
      const active = container.querySelector(".active-year")

      if (active) {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          container.scrollTop =
            active.offsetTop -
            container.clientHeight / 2 +
            active.clientHeight / 2
        }, 0)
      }
    }
  }, [mode, viewDate])

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ]

  const weekdays = ["M","T","W","T","F","S","S"]

  /* ---------- month data ---------- */
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1

  const lastDay = new Date(year, month + 1, 0).getDate()

  const days = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: lastDay }, (_, i) => i + 1)
  ]

  /* ---------- years list - expanded range for better scrolling ---------- */
  const years = Array.from({ length: 200 }, (_, i) => year - 100 + i)

  const selected = new Date(baseDate)

  /* ---------- select day - FIXED ---------- */
  function handlePick(day) {
    // Create date in UTC to avoid timezone issues
    const d = new Date(Date.UTC(year, month, day))
    // Format as YYYY-MM-DD
    const formattedDate = d.toISOString().split('T')[0]
    onSelect(formattedDate)
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
            className="p-1 hover:text-indigo-400"
          >
            ‹
          </button>

          <div className="flex gap-2 text-sm font-medium">
            <button
              onClick={() => setMode("months")}
              className="hover:text-indigo-400 px-2 py-1 rounded"
            >
              {monthNames[month]}
            </button>

            <button
              onClick={() => setMode("years")}
              className="hover:text-indigo-400 px-2 py-1 rounded"
            >
              {year}
            </button>
          </div>

          <button 
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="p-1 hover:text-indigo-400"
          >
            ›
          </button>
        </div>

        {/* DAYS VIEW */}
        {mode === "days" && (
          <>
            {/* weekdays */}
            <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">
              {weekdays.map(d => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>

            {/* days grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {days.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />

                const isSelected =
                  selected.getDate() === day &&
                  selected.getMonth() === month &&
                  selected.getFullYear() === year

                return (
                  <button
                    key={`${year}-${month}-${day}`}
                    onClick={() => handlePick(day)}
                    className={`
                      p-2 rounded-lg cursor-pointer transition-colors
                      ${isSelected
                        ? "bg-indigo-600 text-white font-medium"
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
          <div className="grid grid-cols-3 gap-2 text-center">
            {monthNames.map((m, i) => {
              const active = i === month

              return (
                <button
                  key={m}
                  onClick={() => {
                    setViewDate(new Date(year, i, 1))
                    setMode("days")
                  }}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-colors
                    ${active
                      ? "bg-indigo-600 text-white font-medium"
                      : "hover:bg-indigo-600/80"
                    }
                  `}
                >
                  {m}
                </button>
              )
            })}
          </div>
        )}

        {/* YEAR VIEW - SCROLLABLE GRID */}
        {mode === "years" && (
          <div className="relative">
            {/* Scrollable grid container */}
            <div
              ref={yearScrollRef}
              className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            >
              <div className="grid grid-cols-4 gap-2 p-1">
                {years.map(y => {
                  const active = y === year

                  return (
                    <button
                      key={y}
                      onClick={() => {
                        setViewDate(new Date(y, month, 1))
                        setMode("days")
                      }}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-colors text-center
                        ${active
                          ? "bg-indigo-600 text-white font-medium active-year"
                          : "hover:bg-indigo-600/80"
                        }
                      `}
                    >
                      {y}
                    </button>
                  )
                })}
              </div>
            </div>
            
            <div className="absolute top-0 left-0 right-0 h-6 bg-linear-to-b from-[#171717] via-[#171717] to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-[#171717] via-[#171717] to-transparent pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  )
}

export default SelectDate