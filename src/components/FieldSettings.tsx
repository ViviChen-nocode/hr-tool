import { useState } from 'react'
import { useOrgStore } from '../store/useOrgStore'
import type { FieldConfig } from '../types'

const DEFAULT_KEYS = new Set(['name', 'title', 'department'])

interface FieldSettingsProps {
  onClose: () => void
}

export default function FieldSettings({ onClose }: FieldSettingsProps) {
  const { getCurrentChart, addField, removeField, updateFieldConfig } =
    useOrgStore()
  const chart = getCurrentChart()
  const fieldConfigs = chart.fieldConfigs

  const [newLabel, setNewLabel] = useState('')
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null)

  const handleAddField = () => {
    const label = newLabel.trim()
    if (!label) return
    // Generate a unique key from label
    const key = `custom_${Date.now()}`
    const config: FieldConfig = { key, label, visible: true }
    addField(config)
    setNewLabel('')
  }

  const handleToggleVisible = (key: string, currentVisible: boolean) => {
    updateFieldConfig(key, { visible: !currentVisible })
  }

  const handleDelete = (key: string) => {
    if (confirmDeleteKey === key) {
      removeField(key)
      setConfirmDeleteKey(null)
    } else {
      setConfirmDeleteKey(key)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddField()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">欄位設定</h2>
          <button
            type="button"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Field list */}
        <div className="max-h-[50vh] overflow-y-auto px-5 py-3">
          {fieldConfigs.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between border-b border-gray-100 py-2.5 last:border-b-0"
            >
              <span className="text-sm text-gray-700">
                {field.label}
                {DEFAULT_KEYS.has(field.key) && (
                  <span className="ml-1.5 text-xs text-gray-400">
                    (預設)
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                {/* Visible toggle */}
                <label className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span>顯示</span>
                  <input
                    type="checkbox"
                    checked={field.visible}
                    disabled={field.key === 'name'}
                    onChange={() =>
                      handleToggleVisible(field.key, field.visible)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-500 accent-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </label>

                {/* Delete button (only for custom fields) */}
                {!DEFAULT_KEYS.has(field.key) && (
                  <button
                    type="button"
                    className={`rounded px-2 py-0.5 text-xs transition-colors ${
                      confirmDeleteKey === field.key
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'text-red-400 hover:bg-red-50 hover:text-red-600'
                    }`}
                    onClick={() => handleDelete(field.key)}
                  >
                    {confirmDeleteKey === field.key ? '確認刪除' : '刪除'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add custom field */}
        <div className="border-t border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="新增自訂欄位名稱"
              className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <button
              type="button"
              disabled={!newLabel.trim()}
              className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleAddField}
            >
              新增
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
