import { useState, useMemo } from "react"
import { useApp } from "../../context/AppContext"
import ShowTasks from "../Mainlayout/components/Calendar/ShowTasks"

/* ---------- Task Item Component ---------- */
function TaskItem({ task, onToggleComplete }) {
  return (
    <div
      className={`
        flex items-center gap-2 px-2 py-1.5 rounded-lg
        text-xs transition-colors cursor-pointer group
        ${task.completed 
          ? 'bg-gray-800/30 text-gray-500 hover:bg-gray-800/50' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }
      `}
    >
      <button 
        onClick={(e) => onToggleComplete(task.id, e)}
        className={`
          w-4 h-4 rounded flex items-center justify-center
          transition-all duration-200 shrink-0
          ${task.completed
            ? 'bg-green-500 text-white'
            : 'border border-gray-500 hover:border-indigo-500'
          }
        `}
      >
        {task.completed && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span className={`flex-1 truncate ${task.completed ? 'line-through text-gray-500' : ''}`}>
        {task.title}
      </span>
    </div>
  )
}

/* ---------- Task List Component ---------- */
function TaskList({ tasks, onToggleComplete, emptyMessage }) {
  return (
    <div className="space-y-1.5">
      {tasks.length > 0 ? (
        tasks.map(task => (
          <TaskItem key={task.id} task={task} onToggleComplete={onToggleComplete} />
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-[#9c9c9c]">{emptyMessage}</p>
        </div>
      )}
    </div>
  )
}

/* ---------- Notes Section Component ---------- */
function NotesSection({ notes, updateNotes, isNotesFocused, setIsNotesFocused }) {
  return (
    <div className="border-t border-[#2a2a2a] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-[#9c9c9c] uppercase tracking-wider">
          Notes
        </h3>
        {notes && (
          <span className="text-xs text-[#6b6b6b]">
            {notes.split('\n').filter(line => line.trim()).length} lines
          </span>
        )}
      </div>

      <div className={`
        rounded-lg transition-all duration-200
        ${isNotesFocused ? 'ring-1 ring-[#4f46e5]' : ''}
      `}>
        <textarea
          value={notes}
          onChange={(e) => updateNotes(e.target.value)}
          onFocus={() => setIsNotesFocused(true)}
          onBlur={() => setIsNotesFocused(false)}
          placeholder="Write your notes here..."
          className="w-full resize-none bg-transparent text-sm text-[#e4e4e4] placeholder-[#6b6b6b] outline-none min-h-25"
          style={{ lineHeight: '1.6' }}
        />
      </div>

      {notes && (
        <div className="mt-2 text-right">
          <span className="text-xs text-[#6b6b6b]">
            {notes.length} characters
          </span>
        </div>
      )}
    </div>
  )
}

/* ---------- Main Rightbar Component ---------- */
function Rightbar() {
  const { selectedDate, tasks, notes, updateNotes, updateTask } = useApp()
  const [filterBy, setFilterBy] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isNotesFocused, setIsNotesFocused] = useState(false)

  /* ---------- Toggle task completion ---------- */
  function toggleTaskCompletion(taskId, e) {
    e.stopPropagation()
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      const newCompleted = !task.completed
      updateTask(taskId, { 
        completed: newCompleted,
        status: newCompleted ? "completed" : "not-started"
      })
    }
  }

  /* ---------- Get tasks for selected date ---------- */
  const todaysTasks = useMemo(() => {
    return tasks.filter(task => task.date === selectedDate)
  }, [tasks, selectedDate])
  
  /* ---------- Apply filters ---------- */
  const filteredTasks = useMemo(() => {
    return todaysTasks.filter(task => {
      if (filterBy === "priority" && priorityFilter !== "all") {
        return task.priority === priorityFilter
      }
      if (filterBy === "status" && statusFilter !== "all") {
        if (statusFilter === "completed") return task.completed === true
        if (statusFilter === "not-started") return task.status === "not-started" && !task.completed
        if (statusFilter === "ongoing") return task.status === "ongoing" && !task.completed
      }
      return true
    })
  }, [todaysTasks, filterBy, priorityFilter, statusFilter])

  /* ---------- Group tasks by status ---------- */
  const tasksByStatus = useMemo(() => ({
    "not-started": todaysTasks.filter(t => !t.completed && t.status === "not-started"),
    "ongoing": todaysTasks.filter(t => !t.completed && t.status === "ongoing"),
    "completed": todaysTasks.filter(t => t.completed === true)
  }), [todaysTasks])

  /* ---------- Calculate stats ---------- */
  const totalTasks = todaysTasks.length
  const completedTasks = todaysTasks.filter(t => t.completed).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <aside className="h-screen w-[320px] bg-[#1a1a1a] border-l border-[#2a2a2a] flex flex-col text-[#e4e4e4]">
      {/* Header */}
      <div className="p-5 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-medium text-[#9c9c9c] uppercase tracking-wider">Daily Overview</h2>
          {totalTasks > 0 && <span className="text-xs text-[#9c9c9c]">{completedTasks}/{totalTasks}</span>}
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">
            {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </h1>
          {totalTasks > 0 && <div className="text-sm font-medium text-[#9c9c9c]">{completionRate}%</div>}
        </div>

        {totalTasks > 0 && (
          <div className="mt-3 h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div className="h-full bg-[#4f46e5] rounded-full transition-all duration-300" style={{ width: `${completionRate}%` }} />
          </div>
        )}
      </div>

      {/* Filter Tabs and Sub-filters */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex gap-1 border-b border-[#2a2a2a]">
          {[
            { id: "all", label: "All" },
            { id: "priority", label: "Priority" },
            { id: "status", label: "Status" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setFilterBy(tab.id); setPriorityFilter("all"); setStatusFilter("all") }}
              className={`px-3 py-2 text-xs font-medium transition-all relative ${filterBy === tab.id ? 'text-white' : 'text-[#9c9c9c] hover:text-[#e4e4e4]'}`}
            >
              {tab.label}
              {filterBy === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4f46e5] rounded-full" />}
            </button>
          ))}
        </div>

        {/* Priority Sub-filters */}
        {filterBy === "priority" && (
          <div className="flex flex-wrap gap-1 mt-3">
            {[
              { id: "all", label: "All" },
              { id: "high", label: "High" },
              { id: "medium", label: "Med" },
              { id: "low", label: "Low" }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setPriorityFilter(filter.id)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all ${priorityFilter === filter.id ? (filter.id === "high" ? 'bg-rose-500/20 text-rose-400' : filter.id === "medium" ? 'bg-amber-500/20 text-amber-400' : filter.id === "low" ? 'bg-sky-500/20 text-sky-400' : 'bg-[#4f46e5]/20 text-[#4f46e5]') : 'text-[#9c9c9c] hover:bg-[#2a2a2a] hover:text-[#e4e4e4]'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Status Sub-filters */}
        {filterBy === "status" && (
          <div className="flex flex-wrap gap-1 mt-3">
            {[
              { id: "all", label: "All" },
              { id: "not-started", label: "Not Started" },
              { id: "ongoing", label: "Ongoing" },
              { id: "completed", label: "Completed" }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all ${statusFilter === filter.id ? (filter.id === "completed" ? 'bg-emerald-500/20 text-emerald-400' : filter.id === "ongoing" ? 'bg-sky-500/20 text-sky-400' : filter.id === "not-started" ? 'bg-[#6b7280]/20 text-[#9ca3af]' : 'bg-[#4f46e5]/20 text-[#4f46e5]') : 'text-[#9c9c9c] hover:bg-[#2a2a2a] hover:text-[#e4e4e4]'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {/* ALL TASKS VIEW */}
        {filterBy === "all" && (
          <div className="space-y-1">
            {todaysTasks.length > 0 ? (
              <ShowTasks date={selectedDate} mode="list" />
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-[#9c9c9c]">No tasks for today</p>
                <p className="text-xs text-[#6b6b6b] mt-1">Click the + button to add one</p>
              </div>
            )}
          </div>
        )}

        {/* PRIORITY VIEW - Grouped */}
        {filterBy === "priority" && priorityFilter === "all" && (
          <div className="space-y-5">
            {[
              { title: "High Priority", tasks: todaysTasks.filter(t => t.priority === "high"), color: "rose-500" },
              { title: "Medium Priority", tasks: todaysTasks.filter(t => t.priority === "medium"), color: "amber-500" },
              { title: "Low Priority", tasks: todaysTasks.filter(t => t.priority === "low"), color: "sky-500" }
            ].map(({ title, tasks: sectionTasks, color }) => (
              sectionTasks.length > 0 && (
                <div key={title}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-1.5 h-1.5 bg-${color} rounded-full`} />
                    <h3 className="text-xs font-medium text-[#9c9c9c] uppercase tracking-wider">
                      {title} · {sectionTasks.length}
                    </h3>
                  </div>
                  <TaskList tasks={sectionTasks} onToggleComplete={toggleTaskCompletion} emptyMessage="" />
                </div>
              )
            ))}
            {todaysTasks.length === 0 && <div className="text-center py-8"><p className="text-sm text-[#9c9c9c]">No tasks for today</p></div>}
          </div>
        )}

        {/* PRIORITY VIEW - Filtered */}
        {filterBy === "priority" && priorityFilter !== "all" && (
          <TaskList tasks={filteredTasks} onToggleComplete={toggleTaskCompletion} emptyMessage={`No ${priorityFilter} priority tasks`} />
        )}

        {/* STATUS VIEW - Grouped */}
        {filterBy === "status" && statusFilter === "all" && (
          <div className="space-y-5">
            {[
              { title: "Not Started", key: "not-started" },
              { title: "Ongoing", key: "ongoing" },
              { title: "Completed", key: "completed" }
            ].map(({ title, key }) => {
              const sectionTasks = tasksByStatus[key]
              return sectionTasks.length > 0 && (
                <div key={key}>
                  <h3 className="text-xs font-medium text-[#9c9c9c] uppercase tracking-wider mb-2">
                    {title} · {sectionTasks.length}
                  </h3>
                  <TaskList tasks={sectionTasks} onToggleComplete={toggleTaskCompletion} emptyMessage="" />
                </div>
              )
            })}
            {todaysTasks.length === 0 && <div className="text-center py-8"><p className="text-sm text-[#9c9c9c]">No tasks for today</p></div>}
          </div>
        )}

        {/* STATUS VIEW - Filtered */}
        {filterBy === "status" && statusFilter !== "all" && (
          <TaskList tasks={filteredTasks} onToggleComplete={toggleTaskCompletion} emptyMessage={`No ${statusFilter.replace('-', ' ')} tasks`} />
        )}
      </div>

      {/* Notes Section */}
      <NotesSection notes={notes} updateNotes={updateNotes} isNotesFocused={isNotesFocused} setIsNotesFocused={setIsNotesFocused} />
    </aside>
  )
}

export default Rightbar