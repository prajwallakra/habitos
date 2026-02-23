import TaskList from "./TaskList"

function TaskSection({
  filterBy, priorityFilter, statusFilter,
  todaysTasks, filteredTasks, tasksByStatus,
  onToggleComplete
}) {
  return (
    <div className="flex-1 overflow-y-auto px-5 py-3">

      {/* ALL TASKS */}
      {filterBy === "all" && (
        <AllTasksView
          tasks={todaysTasks}
          onToggleComplete={onToggleComplete}
        />
      )}

      {/* PRIORITY GROUPED */}
      {filterBy === "priority" && priorityFilter === "all" && (
        <PriorityGroupedView
          tasks={todaysTasks}
          onToggleComplete={onToggleComplete}
        />
      )}

      {/* PRIORITY FILTERED */}
      {filterBy === "priority" && priorityFilter !== "all" && (
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={onToggleComplete}
          emptyMessage={`No ${priorityFilter} priority tasks`}
        />
      )}

      {/* STATUS GROUPED */}
      {filterBy === "status" && statusFilter === "all" && (
        <StatusGroupedView
          tasksByStatus={tasksByStatus}
          onToggleComplete={onToggleComplete}
        />
      )}

      {/* STATUS FILTERED */}
      {filterBy === "status" && statusFilter !== "all" && (
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={onToggleComplete}
          emptyMessage={`No ${statusFilter.replace("-", " ")} tasks`}
        />
      )}
    </div>
  )
}

/* ================= ALL TASKS ================= */

function AllTasksView({ tasks, onToggleComplete }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-(--text-secondary)">
          No tasks for today
        </p>
        <p className="text-xs text-(--text-secondary) opacity-70 mt-1">
          Click the + button to add one
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <TaskList tasks={tasks} onToggleComplete={onToggleComplete} />
    </div>
  )
}

/* ================= PRIORITY GROUP ================= */

function PriorityGroupedView({ tasks, onToggleComplete }) {

  const priorityGroups = [
    { title: "High Priority", tasks: tasks.filter(t => t.priority === "high"), color: "rose-500" },
    { title: "Medium Priority", tasks: tasks.filter(t => t.priority === "medium"), color: "amber-500" },
    { title: "Low Priority", tasks: tasks.filter(t => t.priority === "low"), color: "sky-500" }
  ]

  const hasAnyTasks = priorityGroups.some(g => g.tasks.length > 0)

  if (!hasAnyTasks) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-(--text-secondary)">
          No tasks for today
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {priorityGroups.map(({ title, tasks: sectionTasks, color }) =>
        sectionTasks.length > 0 && (
          <div key={title}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-1.5 h-1.5 bg-${color} rounded-full`} />
              <h3 className="text-xs font-medium text-(--text-secondary) uppercase tracking-wider">
                {title} · {sectionTasks.length}
              </h3>
            </div>

            <TaskList tasks={sectionTasks} onToggleComplete={onToggleComplete} />
          </div>
        )
      )}
    </div>
  )
}

/* ================= STATUS GROUP ================= */

function StatusGroupedView({ tasksByStatus, onToggleComplete }) {

  const statusGroups = [
    { title: "Not Started", key: "not-started" },
    { title: "Ongoing", key: "ongoing" },
    { title: "Completed", key: "completed" }
  ]

  const hasAnyTasks = statusGroups.some(
    g => tasksByStatus[g.key].length > 0
  )

  if (!hasAnyTasks) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-(--text-secondary)">
          No tasks for today
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {statusGroups.map(({ title, key }) => {
        const sectionTasks = tasksByStatus[key]

        return sectionTasks.length > 0 && (
          <div key={key}>
            <h3 className="text-xs font-medium text-(--text-secondary) uppercase tracking-wider mb-2">
              {title} · {sectionTasks.length}
            </h3>

            <TaskList tasks={sectionTasks} onToggleComplete={onToggleComplete} />
          </div>
        )
      })}
    </div>
  )
}

export default TaskSection