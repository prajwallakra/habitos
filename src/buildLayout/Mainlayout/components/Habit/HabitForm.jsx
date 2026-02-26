import { useState } from "react"
import { useApp } from "../../../../context/AppContext"

const COLOR_OPTIONS = [
  "#6366f1", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"
]

const TARGET_OPTIONS = [
  { value: 30, label: "30 Days" },
  { value: 90, label: "90 Days" },
  { value: 180, label: "180 Days" },
  { value: 365, label: "365 Days (Year)" },
  { value: 730, label: "2 Years" },
  { value: 1095, label: "3 Years" },
]

function HabitForm({ habit, onClose }) {
  const { addHabit, updateHabit } = useApp()

  const [formData, setFormData] = useState({
    name: habit?.name || "",
    description: habit?.description || "",
    color: habit?.color || "#6366f1",
    targetDays: habit?.targetDays || 365
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    if (habit) {
      updateHabit(habit.id, formData)
      onClose()
    } else {
      const newHabitId = crypto.randomUUID()
      addHabit({
        id: newHabitId,
        ...formData,
        createdAt: new Date().toISOString()
      })
      onClose(newHabitId)
    }
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

/* ================= MODAL ================= */

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

function ModalContent({ title, children }) {
  return (
    <div
      className="bg-(--bg-card) rounded-xl w-full max-w-md border border-(--border)"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-(--text-primary) mb-4">
          {title}
        </h3>
        {children}
      </div>
    </div>
  )
}

/* ================= FORM ================= */

function Form({ formData, onSubmit, onUpdateField, onClose, isEditing }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">

      <InputField
        label="Habit Name"
        value={formData.name}
        onChange={(v)=>onUpdateField("name",v)}
        placeholder="e.g., Morning Meditation"
        autoFocus
      />

      <InputField
        label="Description (Optional)"
        value={formData.description}
        onChange={(v)=>onUpdateField("description",v)}
        placeholder="e.g., 10 minutes of mindfulness"
      />

      <TargetSelector
        value={formData.targetDays}
        onChange={(v)=>onUpdateField("targetDays",parseInt(v))}
      />

      <ColorPicker
        selectedColor={formData.color}
        onColorSelect={(c)=>onUpdateField("color",c)}
      />

      <FormActions
        onClose={onClose}
        isEditing={isEditing}
        isValid={!!formData.name.trim()}
      />
    </form>
  )
}

/* ================= INPUT ================= */

function InputField({ label, value, onChange, placeholder, autoFocus }) {
  return (
    <div>
      <label className="text-xs text-(--text-secondary) uppercase tracking-wider mb-1 block">
        {label}
      </label>

      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="
          w-full
          bg-(--bg-hover)
          border border-(--border)
          rounded-lg px-4 py-2.5
          text-(--text-primary)
          placeholder-(--text-secondary)
          focus:outline-none focus:border-indigo-500
        "
      />
    </div>
  )
}

/* ================= TARGET ================= */

function TargetSelector({ value, onChange }) {
  return (
    <div>
      <label className="text-xs text-(--text-secondary) uppercase tracking-wider mb-1 block">
        Target Duration
      </label>

      <select
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="
          w-full
          bg-(--bg-hover)
          border border-(--border)
          rounded-lg px-4 py-2.5
          text-(--text-primary)
          focus:outline-none focus:border-indigo-500
        "
      >
        {TARGET_OPTIONS.map(opt=>(
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <p className="text-[10px] text-(--text-secondary) opacity-70 mt-1">
        How many days do you want to track this habit?
      </p>
    </div>
  )
}

/* ================= COLORS ================= */

function ColorPicker({ selectedColor, onColorSelect }) {
  return (
    <div>
      <label className="text-xs text-(--text-secondary) uppercase tracking-wider mb-2 block">
        Color
      </label>

      <div className="flex gap-2">
        {COLOR_OPTIONS.map(color=>(
          <button
            key={color}
            type="button"
            onClick={()=>onColorSelect(color)}
            className={`w-8 h-8 rounded-full transition-all ${
              selectedColor===color
                ? "ring-2 ring-(--text-primary) scale-110"
                : "hover:scale-105"
            }`}
            style={{backgroundColor:color}}
          />
        ))}
      </div>
    </div>
  )
}

/* ================= ACTIONS ================= */

function FormActions({ onClose, isEditing, isValid }) {
  return (
    <div className="flex gap-3 pt-4">

      <button
        type="button"
        onClick={onClose}
        className="
          flex-1 px-4 py-2.5
          bg-(--bg-hover)
          text-(--text-primary)
          rounded-lg hover:opacity-80 transition
        "
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={!isValid}
        className={`
          flex-1 px-4 py-2.5 rounded-lg font-medium transition-all
          ${
            isValid
              ? "bg-indigo-600 text-white hover:bg-indigo-500"
              : "bg-(--border) text-(--text-secondary) cursor-not-allowed"
          }
        `}
      >
        {isEditing ? "Save Changes" : "Create Habit"}
      </button>

    </div>
  )
}

export default HabitForm