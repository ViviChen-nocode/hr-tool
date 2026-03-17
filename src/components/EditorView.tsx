import { useCallback, useRef, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { useAppStore } from '../store/useAppStore'
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
  const [panelWidth, setPanelWidth] = useState(320)
  const dragging = useRef(false)

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
            className="flex flex-col border-r border-gray-200 bg-white"
            style={{ width: panelWidth, minWidth: MIN_PANEL_WIDTH }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
              <button
                type="button"
                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
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
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    inputMode === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
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

          {/* Resize handle */}
          <div
            className="w-1 cursor-col-resize bg-gray-200 hover:bg-blue-400 active:bg-blue-500 transition-colors"
            onMouseDown={handleMouseDown}
          />

          {/* Right canvas */}
          <div className="flex-1 bg-gray-50">
            <OrgChartCanvas />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  )
}
