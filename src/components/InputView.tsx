import { useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useOrgStore } from '../store/useOrgStore'
import { useStyleStore } from '../store/useStyleStore'
import TableInput from './TableInput'
import TreeInput from './TreeInput'
import MobileHint from './MobileHint'
import { parseCsv, generateTemplateCsv, downloadCsv } from '../utils/csvImport'
import type { InputMode } from '../types'

const tabs: { key: InputMode; label: string }[] = [
  { key: 'table', label: '表格模式' },
  { key: 'tree', label: '樹狀模式' },
]

export default function InputView() {
  const { inputMode, setInputMode, setView } = useAppStore()
  const chart = useOrgStore((s) => s.getCurrentChart())
  const importMembers = useOrgStore((s) => s.importMembers)
  const preset = useStyleStore((s) => s.getPreset())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const hasNamedMember = chart.members.some((m) => m.name.trim() !== '')

  const handleGenerate = () => {
    if (!hasNamedMember) return
    setView('editor')
  }

  const handleImportClick = () => {
    setImportError(null)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string
        const result = parseCsv(text)
        if (result.members.length === 0) {
          setImportError('CSV 中沒有有效的資料列')
          return
        }

        const hasExisting = chart.members.some((m) => m.name.trim() !== '')
        if (hasExisting) {
          const ok = window.confirm(
            `將匯入 ${result.members.length} 筆資料，這會取代目前的成員資料。確定繼續？`,
          )
          if (!ok) return
        }

        importMembers(result.members, result.fieldConfigs)
        setImportError(null)
      } catch (err) {
        setImportError(err instanceof Error ? err.message : '匯入失敗')
      }
    }
    reader.readAsText(file, 'UTF-8')

    // Reset input so same file can be re-imported
    e.target.value = ''
  }

  const handleDownloadTemplate = () => {
    downloadCsv(generateTemplateCsv(), '組織圖範本.csv')
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-4 overflow-auto">
      <MobileHint />
      <div className="w-full max-w-3xl max-h-full flex flex-col rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        {/* Colored header area */}
        <div
          className="shrink-0 px-8 pt-8 pb-6"
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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">建立組織圖</h1>
              <p className="text-sm text-gray-400">輸入成員資料後，點擊下方按鈕產生組織圖</p>
            </div>
            {/* CSV import buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={handleDownloadTemplate}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                CSV 範本
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors"
                style={{ backgroundColor: preset.accent }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = preset.accentHover }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = preset.accent }}
                onClick={handleImportClick}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                匯入 CSV
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {importError && (
            <div className="mt-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
              {importError}
            </div>
          )}
        </div>

        <div className="px-8 py-6 overflow-auto flex-1 min-h-0">
          {/* Usage guide */}
          <div className="mb-5 rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500 leading-relaxed">
            <p className="mb-1">手動輸入或匯入 CSV 快速建立成員資料，自動產生組織架構圖</p>
            <p className="mb-1">資料自動儲存於瀏覽器，支援多張組織圖管理，完成後可匯出為 PNG</p>
            <p className="text-amber-600">⚠ 清除瀏覽資料會導致資料遺失，重要資料請匯出保存</p>
          </div>

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
        </div>

        {/* Generate button - sticky at bottom */}
        <div className="shrink-0 border-t border-gray-100 bg-white px-8 py-4">
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

          {/* Privacy notice */}
          <p className="mt-3 text-center text-xs text-gray-400">
            <svg className="inline-block h-3 w-3 mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            所有資料僅儲存於您的瀏覽器，不會上傳至任何伺服器
          </p>
        </div>
      </div>
    </div>
  )
}
