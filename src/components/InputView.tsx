import { useAppStore } from '../store/useAppStore'
import { useOrgStore } from '../store/useOrgStore'
import { useStyleStore } from '../store/useStyleStore'
import TableInput from './TableInput'
import TreeInput from './TreeInput'
import type { InputMode } from '../types'

const tabs: { key: InputMode; label: string }[] = [
  { key: 'table', label: '表格模式' },
  { key: 'tree', label: '樹狀模式' },
]

export default function InputView() {
  const { inputMode, setInputMode, setView } = useAppStore()
  const getCurrentChart = useOrgStore((s) => s.getCurrentChart)
  const preset = useStyleStore((s) => s.getPreset())

  const handleGenerate = () => {
    const chart = getCurrentChart()
    const hasNamedMember = chart.members.some((m) => m.name.trim() !== '')
    if (!hasNamedMember) return
    setView('editor')
  }

  const chart = getCurrentChart()
  const hasNamedMember = chart.members.some((m) => m.name.trim() !== '')

  return (
    <div className="flex h-full items-center justify-center bg-gray-50 p-4 overflow-auto">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        {/* Colored header area */}
        <div
          className="px-8 pt-8 pb-6"
          style={{
            background: `linear-gradient(135deg, ${preset.headerGradientFrom}08, ${preset.headerGradientTo}12)`,
            borderBottom: `1px solid ${preset.accent}15`,
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${preset.gradientFrom}, ${preset.gradientTo})`,
              }}
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">建立組織圖</h1>
              <p className="text-sm text-gray-400">輸入成員資料後，點擊下方按鈕產生組織圖</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Tabs */}
          <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors"
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

          {/* Content */}
          <div className="mb-6">
            {inputMode === 'table' ? (
              <TableInput />
            ) : (
              <TreeInput />
            )}
          </div>

          {/* Generate button */}
          <button
            type="button"
            disabled={!hasNamedMember}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            style={{
              backgroundColor: hasNamedMember ? preset.accent : undefined,
            }}
            onMouseEnter={(e) => { if (hasNamedMember) e.currentTarget.style.backgroundColor = preset.accentHover }}
            onMouseLeave={(e) => { if (hasNamedMember) e.currentTarget.style.backgroundColor = preset.accent }}
            onClick={handleGenerate}
          >
            產生組織圖
          </button>
        </div>
      </div>
    </div>
  )
}
