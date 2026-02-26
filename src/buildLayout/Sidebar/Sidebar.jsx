import { Home, Calendar, CheckSquare, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

function Sidebar() {

  /* ================= THEME STATE ================= */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }

  /* ================= STYLES ================= */

  const iconClass =
    "w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--bg-hover)] hover:bg-indigo-600 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer";

  return (
    <aside className="h-screen w-16 bg-(--bg-card) border-r border-(--border) flex flex-col items-center py-6">

      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
        H
      </div>
      {/* ================= THEME TOGGLE ================= */}
      <div className="mt-10">
        <button
          onClick={toggleTheme}
          className={iconClass}
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-5 mt-8">

        <div className={iconClass}  title="Dashboard">
          <Home size={18} />
        </div>

        <div className={iconClass} title="Calendar">
          <Calendar size={18} />
        </div>

        <div className={iconClass} title="Habits">
          <CheckSquare size={18} />
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;