function Leftbar() {
  return (
    <aside className="h-screen w-[320px] bg-[#171717] border-l border-[#2a2a2a] p-6 flex flex-col text-gray-200">

      {/* Date */}
      <h2 className="text-xl font-semibold mb-6">
        Today
      </h2>

      {/* Tasks */}
      <section className="mb-8">
        <h3 className="text-gray-400 mb-3 text-sm uppercase tracking-wide">
          Tasks
        </h3>

        <div className="space-y-3">
          {[1,2,3].map(task => (
            <div
              key={task}
              className="bg-[#1f1f1f] hover:bg-[#262626] transition p-3 rounded-lg cursor-pointer"
            >
              Task {task}
            </div>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section className="flex-1 flex flex-col">
        <h3 className="text-gray-400 mb-3 text-sm uppercase tracking-wide">
          Notes
        </h3>

        <textarea
          placeholder="Write notes..."
          className="flex-1 resize-none bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg p-3 outline-none focus:border-indigo-500"
        />
      </section>

    </aside>
  )
}

export default Leftbar
