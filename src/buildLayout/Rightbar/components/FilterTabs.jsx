function FilterTabs({ 
  filterBy, setFilterBy, 
  priorityFilter, setPriorityFilter, 
  statusFilter, setStatusFilter 
}) {
  const handleTabChange = (tabId) => {
    setFilterBy(tabId)
    setPriorityFilter("all")
    setStatusFilter("all")
  }

  return (
    <div className="px-5 pt-4 pb-2">
      <div className="flex gap-1 border-b border-[#2a2a2a]">
        <TabButton 
          id="all" 
          label="All" 
          active={filterBy === "all"} 
          onClick={handleTabChange}
        />
        <TabButton 
          id="priority" 
          label="Priority" 
          active={filterBy === "priority"} 
          onClick={handleTabChange}
        />
        <TabButton 
          id="status" 
          label="Status" 
          active={filterBy === "status"} 
          onClick={handleTabChange}
        />
      </div>

      {filterBy === "priority" && (
        <PriorityFilters 
          priorityFilter={priorityFilter} 
          setPriorityFilter={setPriorityFilter} 
        />
      )}

      {filterBy === "status" && (
        <StatusFilters 
          statusFilter={statusFilter} 
          setStatusFilter={setStatusFilter} 
        />
      )}
    </div>
  )
}

function TabButton({ id, label, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`
        px-3 py-2 text-xs font-medium transition-all relative
        ${active ? 'text-white' : 'text-[#9c9c9c] hover:text-[#e4e4e4]'}
      `}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4f46e5] rounded-full" />
      )}
    </button>
  )
}

function PriorityFilters({ priorityFilter, setPriorityFilter }) {
  const filters = [
    { id: "all", label: "All", color: "indigo" },
    { id: "high", label: "High", color: "rose" },
    { id: "medium", label: "Med", color: "amber" },
    { id: "low", label: "Low", color: "sky" }
  ]

  return (
    <div className="flex flex-wrap gap-1 mt-3">
      {filters.map(filter => (
        <FilterButton
          key={filter.id}
          filter={filter}
          currentFilter={priorityFilter}
          setFilter={setPriorityFilter}
          getColorClass={(id) => {
            if (id === "high") return 'bg-rose-500/20 text-rose-400'
            if (id === "medium") return 'bg-amber-500/20 text-amber-400'
            if (id === "low") return 'bg-sky-500/20 text-sky-400'
            return 'bg-[#4f46e5]/20 text-[#4f46e5]'
          }}
        />
      ))}
    </div>
  )
}

function StatusFilters({ statusFilter, setStatusFilter }) {
  const filters = [
    { id: "all", label: "All", color: "indigo" },
    { id: "not-started", label: "Not Started", color: "gray" },
    { id: "ongoing", label: "Ongoing", color: "blue" },
    { id: "completed", label: "Completed", color: "green" }
  ]

  return (
    <div className="flex flex-wrap gap-1 mt-3">
      {filters.map(filter => (
        <FilterButton
          key={filter.id}
          filter={filter}
          currentFilter={statusFilter}
          setFilter={setStatusFilter}
          getColorClass={(id) => {
            if (id === "completed") return 'bg-emerald-500/20 text-emerald-400'
            if (id === "ongoing") return 'bg-sky-500/20 text-sky-400'
            if (id === "not-started") return 'bg-[#6b7280]/20 text-[#9ca3af]'
            return 'bg-[#4f46e5]/20 text-[#4f46e5]'
          }}
        />
      ))}
    </div>
  )
}

function FilterButton({ filter, currentFilter, setFilter, getColorClass }) {
  const isActive = currentFilter === filter.id
  
  return (
    <button
      onClick={() => setFilter(filter.id)}
      className={`
        px-2.5 py-1 text-xs rounded-md transition-all
        ${isActive 
          ? getColorClass(filter.id)
          : 'text-[#9c9c9c] hover:bg-[#2a2a2a] hover:text-[#e4e4e4]'
        }
      `}
    >
      {filter.label}
    </button>
  )
}

export default FilterTabs