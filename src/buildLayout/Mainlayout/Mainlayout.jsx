import Calendar from "./components/Calendar"

function MainLayout() {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

  return (
    <main className="flex-1 p-6 overflow-y-auto text-gray-200">

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">
        HABITOS
      </h1>

      {/* Calendar */}
      <Calendar />
      {/* Habits */}
      <section className="bg-[#171717] border border-[#2a2a2a] rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-4">
          Habits
        </h2>

        <div className="flex gap-6 items-center">

          {/* Chart placeholder */}
          <div className="w-40 h-40 rounded-full bg-[#1f1f1f] border border-[#2a2a2a] flex items-center justify-center text-gray-500">
            Chart
          </div>

          {/* Habit List */}
          <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg p-4 space-y-2">
            <p>Study</p>
            <p>Workout</p>
            <p>Read</p>

            <button className="mt-2 text-indigo-500 text-sm">
              + Add Habit
            </button>
          </div>

        </div>

      </section>

    </main>
  )
}

export default MainLayout
