import { Home, Calendar, CheckSquare, Settings } from "lucide-react";

function Sidebar() {

  const iconClass =
    "w-9 h-9 flex items-center justify-center rounded-lg bg-[#1f1f1f] hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer";

  return (
    <aside className="h-screen w-16 bg-[#171717] border-r border-[#2a2a2a] flex flex-col items-center py-6">

      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
        H
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col gap-5 mt-8">

        {/* Dashboard */}
        <div
          onClick={() => console.log("Dashboard")}
          className={`${iconClass} bg-indigo-600`} // active example
          title="Dashboard"
        >
          <Home size={18} />
        </div>

        {/* Calendar */}
        <div
          onClick={() => console.log("Calendar")}
          className={iconClass}
          title="Calendar"
        >
          <Calendar size={18} />
        </div>

        {/* Habits */}
        <div
          onClick={() => console.log("Habits")}
          className={iconClass}
          title="Habits"
        >
          <CheckSquare size={18} />
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;