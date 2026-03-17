import { useEffect, useRef, useState } from 'react'
import { useOrgStore } from '../store/useOrgStore'
import { useAppStore } from '../store/useAppStore'
import { useStyleStore } from '../store/useStyleStore'

export default function ChartSelector() {
  const { charts, currentChartId, addChart, switchChart, deleteChart, renameChart } =
    useOrgStore()
  const setView = useAppStore((s) => s.setView)
  const preset = useStyleStore((s) => s.getPreset())

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentChart = charts.find((c) => c.id === currentChartId)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setEditingId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus input when editing
  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingId])

  const handleSwitch = (id: string) => {
    switchChart(id)
    setIsOpen(false)
    setEditingId(null)

    const chart = charts.find((c) => c.id === id)
    if (chart) {
      const hasMembers = chart.members.some((m) => m.name.trim() !== '')
      setView(hasMembers ? 'editor' : 'input')
    }
  }

  const handleAdd = () => {
    addChart()
    setIsOpen(false)
    setView('input')
  }

  const handleDelete = () => {
    if (charts.length <= 1) return
    const ok = window.confirm(`確定要刪除「${currentChart?.name}」嗎？`)
    if (!ok) return
    deleteChart(currentChartId)
    // After deletion, the store sets currentChartId to remaining[0]
    const remaining = charts.filter((c) => c.id !== currentChartId)
    if (remaining.length > 0) {
      const next = remaining[0]
      const hasMembers = next.members.some((m) => m.name.trim() !== '')
      setView(hasMembers ? 'editor' : 'input')
    }
    setIsOpen(false)
  }

  const startRename = (id: string, name: string) => {
    setEditingId(id)
    setEditName(name)
  }

  const commitRename = () => {
    if (editingId && editName.trim()) {
      renameChart(editingId, editName.trim())
    }
    setEditingId(null)
  }

  return (
    <div
      className="flex items-center gap-2 border-b px-4 py-1.5 text-sm"
      style={{
        background: `linear-gradient(to right, ${preset.headerGradientFrom}, ${preset.headerGradientTo})`,
        borderBottomColor: `${preset.accent}40`,
      }}
    >
      <span className="text-white/70 text-xs font-medium shrink-0">組織圖：</span>

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="flex items-center gap-1 rounded-md border border-white/20 bg-white/15 px-2.5 py-1 text-sm font-medium text-white hover:bg-white/25 transition-colors"
          onClick={() => setIsOpen((p) => !p)}
        >
          <span className="max-w-[200px] truncate">{currentChart?.name ?? '—'}</span>
          <svg
            className={`h-3.5 w-3.5 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1 z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="max-h-60 overflow-y-auto py-1">
              {charts.map((chart) => (
                <div
                  key={chart.id}
                  className={`group flex items-center gap-1 px-3 py-1.5 ${
                    chart.id !== currentChartId
                      ? 'text-gray-700 hover:bg-gray-50'
                      : ''
                  }`}
                  style={chart.id === currentChartId ? { backgroundColor: preset.accentLight, color: preset.accent } : undefined}
                >
                  {editingId === chart.id ? (
                    <input
                      ref={inputRef}
                      className="flex-1 rounded border border-blue-300 px-1.5 py-0.5 text-sm outline-none"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename()
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      className="flex-1 truncate text-left text-sm"
                      onClick={() => handleSwitch(chart.id)}
                    >
                      {chart.name}
                    </button>
                  )}

                  {editingId !== chart.id && (
                    <button
                      type="button"
                      className="shrink-0 rounded p-0.5 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-600 transition-opacity"
                      title="重新命名"
                      onClick={(e) => {
                        e.stopPropagation()
                        startRename(chart.id, chart.name)
                      }}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 p-1">
              <button
                type="button"
                className="flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                onClick={handleAdd}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                新增組織圖
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete button */}
      <button
        type="button"
        className="rounded p-1 text-white/50 hover:text-red-300 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="刪除目前組織圖"
        disabled={charts.length <= 1}
        onClick={handleDelete}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
