import TaskItem from "./TaskItem"

function TaskList({ tasks, onToggleComplete, emptyMessage = "No tasks" }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[#9c9c9c]">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onToggleComplete={onToggleComplete} 
        />
      ))}
    </div>
  )
}

export default TaskList