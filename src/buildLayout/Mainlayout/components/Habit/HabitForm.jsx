import { useState } from "react"
import { useApp } from "../../../../context/AppContext"

const COLOR_OPTIONS = [
  "#6366f1", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"
]

function HabitForm({ habit, onClose }) {
  const { addHabit, updateHabit } = useApp()
  const [formData, setFormData] = useState({
    name: habit?.name || "",
    description: habit?.description || "",
    color: habit?.color || "#6366f1"
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    if (habit) {
      updateHabit(habit.id, formData)
    } else {
      addHabit({
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString()
      })
    }
    onClose()
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <ModalOverlay onClose={onClose}>
      <ModalContent 
        title={habit ? "Edit Habit" : "Create New Habit"}
        onClose={onClose}
      >
        <Form 
          formData={formData}
          onSubmit={handleSubmit}
          onUpdateField={updateField}
          onClose={onClose}
          isEditing={!!habit}
        />
      </ModalContent>
    </ModalOverlay>
  )
}

// Sub-components
function ModalOverlay({ children, onClose }) {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {children}
    </div>
  )
}

function ModalContent({ title, children, onClose }) {
  return (
    <div 
      className="bg-[#171717] rounded-xl w-full max-w-md border border-[#2a2a2a]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        {children}
      </div>
    </div>
  )
}

function Form({ formData, onSubmit, onUpdateField, onClose, isEditing }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <InputField
        label="Habit Name"
        value={formData.name}
        onChange={(value) => onUpdateField('name', value)}
        placeholder="e.g., Morning Meditation"
        autoFocus
      />

      <InputField
        label="Description (Optional)"
        value={formData.description}
        onChange={(value) => onUpdateField('description', value)}
        placeholder="e.g., 10 minutes of mindfulness"
      />

      <ColorPicker
        selectedColor={formData.color}
        onColorSelect={(color) => onUpdateField('color', color)}
      />

      <FormActions onClose={onClose} isEditing={isEditing} isValid={!!formData.name.trim()} />
    </form>
  )
}

function InputField({ label, value, onChange, placeholder, autoFocus }) {
  return (
    <div>
      <label className="text-xs text-[#9c9c9c] uppercase tracking-wider mb-1 block">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
        autoFocus={autoFocus}
      />
    </div>
  )
}

function ColorPicker({ selectedColor, onColorSelect }) {
  return (
    <div>
      <label className="text-xs text-[#9c9c9c] uppercase tracking-wider mb-2 block">
        Color
      </label>
      <div className="flex gap-2">
        {COLOR_OPTIONS.map(color => (
          <ColorButton
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
    </div>
  )
}

function ColorButton({ color, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-8 h-8 rounded-full transition-all
        ${isSelected ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}
      `}
      style={{ backgroundColor: color }}
    />
  )
}

function FormActions({ onClose, isEditing, isValid }) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 px-4 py-2.5 bg-[#1f1f1f] text-gray-300 rounded-lg hover:bg-[#262626] transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={!isValid}
        className={`
          flex-1 px-4 py-2.5 rounded-lg font-medium transition-all
          ${isValid
            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
            : 'bg-[#2a2a2a] text-[#6b6b6b] cursor-not-allowed'
          }
        `}
      >
        {isEditing ? "Save Changes" : "Create Habit"}
      </button>
    </div>
  )
}

export default HabitForm