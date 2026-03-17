import { useAppStore } from '../store/useAppStore'
import { useOrgStore } from '../store/useOrgStore'
import TableInput from './TableInput'
import type { InputMode } from '../types'

const tabs: { key: InputMode; label: string }[] = [
  { key: 'table', label: '表格模式' },
  { key: 'tree', label: '樹狀模式' },
]

export default function InputView() {
  const { inputMode, setInputMode, setView } = useAppStore()
  const getCurrentChart = useOrgStore((s) => s.getCurrentChart)

  const handleGenerate = () => {
    const chart = getCurrentChart()
    const hasNamedMember = chart.members.some((m) => m.name.trim() !== '')
    if (!hasNamedMember) return
    setView('editor')
  }

  const chart = getCurrentChart()
  const hasNamedMember = chart.members.some((m) => m.name.trim() !== '')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-sm border border-gray-200">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">建立組織圖</h1>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
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

        {/* Content */}
        <div className="mb-6">
          {inputMode === 'table' ? (
            <TableInput />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400">
              樹狀模式（開發中）
            </div>
          )}
        </div>

        {/* Generate button */}
        <button
          type="button"
          disabled={!hasNamedMember}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          onClick={handleGenerate}
        >
          產生組織圖
        </button>
      </div>
    </div>
  )
}
