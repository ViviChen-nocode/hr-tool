import { useState } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useAppStore } from '../store/useAppStore'
import { useStyleStore } from '../store/useStyleStore'
import { exportToPng } from '../utils/exportPng'
import FieldSettings from './FieldSettings'
import StyleSettings from './StyleSettings'

export default function Toolbar() {
  const [showFieldSettings, setShowFieldSettings] = useState(false)
  const [showStyleSettings, setShowStyleSettings] = useState(false)
  const {
    layoutDirection,
    setLayoutDirection,
    horizontalSpacing,
    setHorizontalSpacing,
    verticalSpacing,
    setVerticalSpacing,
  } = useAppStore()

  const preset = useStyleStore((s) => s.getPreset())

  const { zoomIn, zoomOut, fitView, getNodes } = useReactFlow()

  return (
    <div
      className="flex flex-wrap items-center gap-3 border-b px-4 py-2"
      style={{
        backgroundColor: preset.accentLight,
        borderBottomColor: `${preset.accent}20`,
      }}
    >
      {/* 方向切換 */}
      <button
        type="button"
        className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
        style={{
          borderColor: `${preset.accent}30`,
          color: '#374151',
          backgroundColor: 'white',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${preset.accent}10` }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
        onClick={() => setLayoutDirection(layoutDirection === 'TB' ? 'LR' : 'TB')}
      >
        {layoutDirection === 'TB' ? (
          <>
            <span className="text-base leading-none">↓</span>
            <span>上→下</span>
          </>
        ) : (
          <>
            <span className="text-base leading-none">→</span>
            <span>左→右</span>
          </>
        )}
      </button>

      {/* 分隔線 */}
      <div className="h-6 w-px" style={{ backgroundColor: `${preset.accent}20` }} />

      {/* 水平間距 */}
      <label className="flex items-center gap-2 text-sm text-gray-600">
        水平間距
        <input
          type="range"
          min={50}
          max={200}
          value={horizontalSpacing}
          onChange={(e) => setHorizontalSpacing(Number(e.target.value))}
          className="h-1.5 w-24 cursor-pointer"
          style={{ accentColor: preset.accent }}
        />
        <span className="w-8 text-xs text-gray-400">{horizontalSpacing}</span>
      </label>

      {/* 垂直間距 */}
      <label className="flex items-center gap-2 text-sm text-gray-600">
        垂直間距
        <input
          type="range"
          min={50}
          max={200}
          value={verticalSpacing}
          onChange={(e) => setVerticalSpacing(Number(e.target.value))}
          className="h-1.5 w-24 cursor-pointer"
          style={{ accentColor: preset.accent }}
        />
        <span className="w-8 text-xs text-gray-400">{verticalSpacing}</span>
      </label>

      {/* 分隔線 */}
      <div className="h-6 w-px" style={{ backgroundColor: `${preset.accent}20` }} />

      {/* 縮放控制 */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-sm text-gray-700 transition-colors"
          style={{ borderColor: `${preset.accent}30`, backgroundColor: 'white' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${preset.accent}10` }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
          onClick={() => zoomOut()}
          title="縮小"
        >
          −
        </button>
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-sm text-gray-700 transition-colors"
          style={{ borderColor: `${preset.accent}30`, backgroundColor: 'white' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${preset.accent}10` }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
          onClick={() => zoomIn()}
          title="放大"
        >
          +
        </button>
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-sm text-gray-700 transition-colors"
          style={{ borderColor: `${preset.accent}30`, backgroundColor: 'white' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${preset.accent}10` }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
          onClick={() => fitView({ padding: 0.2 })}
          title="適合畫面"
        >
          ⊞
        </button>
      </div>

      {/* 分隔線 */}
      <div className="h-6 w-px" style={{ backgroundColor: `${preset.accent}20` }} />

      {/* 欄位設定 */}
      <button
        type="button"
        className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
        style={{ borderColor: `${preset.accent}30`, color: '#374151', backgroundColor: 'white' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${preset.accent}10` }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
        onClick={() => setShowFieldSettings(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
        欄位設定
      </button>

      {/* 樣式設定 */}
      <button
        type="button"
        className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
        style={{ borderColor: `${preset.accent}30`, color: '#374151', backgroundColor: 'white' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${preset.accent}10` }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
        onClick={() => setShowStyleSettings(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M3.5 2A1.5 1.5 0 002 3.5V5c0 .276.224.5.5.5h15a.5.5 0 00.5-.5V3.5A1.5 1.5 0 0016.5 2h-13zM2 8.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v8A1.5 1.5 0 014.5 18h-1A1.5 1.5 0 012 16.5v-8zm6 0a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v8a1.5 1.5 0 01-1.5 1.5h-1A1.5 1.5 0 018 16.5v-8zm6 0a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v8a1.5 1.5 0 01-1.5 1.5h-1A1.5 1.5 0 0114 16.5v-8z"
            clipRule="evenodd"
          />
        </svg>
        樣式設定
      </button>

      {/* 分隔線 */}
      <div className="h-6 w-px" style={{ backgroundColor: `${preset.accent}20` }} />

      {/* 下載圖片 */}
      <button
        type="button"
        className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors"
        style={{ backgroundColor: preset.accent }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = preset.accentHover }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = preset.accent }}
        onClick={() => exportToPng(getNodes)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
        下載圖片（PNG）
      </button>

      {showFieldSettings && (
        <FieldSettings onClose={() => setShowFieldSettings(false)} />
      )}
      {showStyleSettings && (
        <StyleSettings onClose={() => setShowStyleSettings(false)} />
      )}
    </div>
  )
}
