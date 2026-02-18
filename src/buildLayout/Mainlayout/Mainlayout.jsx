import Calendar from "./components/Calendar"
import Habit from "./components/Habit"

function MainLayout() {
  return (
    <main className="flex-1 p-6 overflow-y-auto text-gray-200 bg-[#0a0a0a] space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          HABITOS
        </h1>
        <p className="text-sm text-[#9c9c9c] mt-1">Track your daily habits and build consistency</p>
      </div>

      {/* Calendar Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Weekly Calendar
          </h2>
        </div>
        <Calendar />
      </section>

      {/* Habit Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Habit Tracker
          </h2>
        </div>
        <Habit />
      </section>
    </main>
  )
}

export default MainLayout