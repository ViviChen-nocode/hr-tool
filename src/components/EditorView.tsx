import { useCallback, useRef, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { useAppStore } from '../store/useAppStore'
import { useOrgStore } from '../store/useOrgStore'
import { useStyleStore } from '../store/useStyleStore'
import TableInput from './TableInput'
import TreeInput from './TreeInput'
import OrgChartCanvas from './OrgChartCanvas'
import Toolbar from './Toolbar'
import type { InputMode } from '../types'

const tabs: { key: InputMode; label: string }[] = [
  { key: 'table', label: '表格模式' },
  { key: 'tree', label: '樹狀模式' },
]

const MIN_PANEL_WIDTH = 240
const MAX_PANEL_WIDTH = 600

export default function EditorView() {
  const { inputMode, setInputMode, setView } = useAppStore()
  const chart = useOrgStore((s) => s.getCurrentChart())
  const preset = useStyleStore((s) => s.getPreset())
  const [panelWidth, setPanelWidth] = useState(320)
  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const dragging = useRef(false)
  const hasMembers = chart.members.some((m) => m.name.trim() !== '')

  const handleMouseDown = useCallback(() => {
    dragging.current = true

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const newWidth = Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, e.clientX))
      setPanelWidth(newWidth)
    }

    const onMouseUp = () => {
      dragging.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [])

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Toolbar — full width */}
        <Toolbar />

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel */}
          <div
            className="panel-transition flex flex-col border-r border-gray-200 bg-white overflow-hidden"
            style={{
              width: panelCollapsed ? 0 : panelWidth,
              minWidth: panelCollapsed ? 0 : MIN_PANEL_WIDTH,
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-sm transition-colors"
                style={{
                  borderColor: `${preset.accent}30`,
                  color: preset.accent,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = preset.accentLight }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                onClick={() => setView('input')}
              >
                ← 返回
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 mx-3 mt-3">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150"
                  style={{
                    backgroundColor: inputMode === tab.key ? 'white' : 'transparent',
                    color: inputMode === tab.key ? preset.accent : '#6b7280',
                    boxShadow: inputMode === tab.key ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                  onClick={() => setInputMode(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input content */}
            <div className="flex-1 overflow-y-auto p-3">
              {inputMode === 'table' ? <TableInput /> : <TreeInput />}
            </div>
          </div>

          {/* Collapse toggle + resize handle */}
          <div className="relative flex flex-col items-center">
            {/* Toggle button */}
            <button
              type="button"
              className="absolute top-3 -left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-sm hover:bg-gray-100 hover:text-gray-700 transition-colors"
              onClick={() => setPanelCollapsed((c) => !c)}
              title={panelCollapsed ? '展開側邊面板' : '收合側邊面板'}
            >
              <svg
                className={`h-3 w-3 transition-transform duration-200 ${panelCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Resize handle */}
            {!panelCollapsed && (
              <div
                className="w-1 h-full cursor-col-resize bg-gray-200 transition-colors"
                style={{ '--hover-color': preset.accent } as React.CSSProperties}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = preset.accent }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#e5e7eb' }}
                onMouseDown={handleMouseDown}
              />
            )}
          </div>

          {/* Right canvas */}
          <div className="flex-1 bg-gray-50 relative">
            {!hasMembers && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/80">
                <div className="text-center">
                  <div className="mb-3 text-4xl text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">尚無成員資料</p>
                  <p className="mt-1 text-xs text-gray-400">
                    請在左側面板新增成員，組織圖將自動產生
                  </p>
                </div>
              </div>
            )}
            <OrgChartCanvas />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  )
}
