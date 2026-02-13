function Sidebar() {
  return (
    <aside className="h-screen w-16 bg-[#171717] border-r border-[#2a2a2a] flex flex-col items-center py-6 gap-6">

      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
        H
      </div>

      {/* Icons */}
      <div className="flex flex-col gap-5 mt-4">

        <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] hover:bg-indigo-600 transition cursor-pointer" />

        <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] hover:bg-indigo-600 transition cursor-pointer" />

        <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] hover:bg-indigo-600 transition cursor-pointer" />

      </div>

    </aside>
  )
}

export default Sidebar
