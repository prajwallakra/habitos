import { useEffect } from "react"

function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onCancel()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
      onClick={onCancel}
    >
      <div
        className="bg-(--bg-card) rounded-2xl w-full max-w-md shadow-2xl border border-(--border) p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-(--text-primary)">{title}</h3>

        <p className="mt-2 text-sm text-(--text-secondary)">
          {message}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-(--bg-hover) text-(--text-primary) hover:opacity-90 transition-opacity"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal