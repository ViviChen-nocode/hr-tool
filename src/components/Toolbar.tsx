import { useState } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useAppStore } from '../store/useAppStore'
import { exportToPng } from '../utils/exportPng'
import FieldSettings from './FieldSettings'

export default function Toolbar() {
  const [showFieldSettings, setShowFieldSettings] = useState(false)
  const {
    layoutDirection,
    setLayoutDirection,
    horizontalSpacing,
    setHorizontalSpacing,
    verticalSpacing,
    setVerticalSpacing,
  } = useAppStore()

  const { zoomIn, zoomOut, fitView, getNodes } = useReactFlow()

  return (
    <div className="flex items-center gap-4 border-b border-gray-200 bg-white px-4 py-2">
      {/* 方向切換 */}
      <button
        type="button"
        className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
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
      <div className="h-6 w-px bg-gray-200" />

      {/* 水平間距 */}
      <label className="flex items-center gap-2 text-sm text-gray-600">
        水平間距
        <input
          type="range"
          min={50}
          max={200}
          value={horizontalSpacing}
          onChange={(e) => setHorizontalSpacing(Number(e.target.value))}
          className="h-1.5 w-24 cursor-pointer accent-blue-500"
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
          className="h-1.5 w-24 cursor-pointer accent-blue-500"
        />
        <span className="w-8 text-xs text-gray-400">{verticalSpacing}</span>
      </label>

      {/* 分隔線 */}
      <div className="h-6 w-px bg-gray-200" />

      {/* 縮放控制 */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={() => zoomOut()}
          title="縮小"
        >
          −
        </button>
        <button
          type="button"
          className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={() => zoomIn()}
          title="放大"
        >
          +
        </button>
        <button
          type="button"
          className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={() => fitView({ padding: 0.2 })}
          title="適合畫面"
        >
          ⊞
        </button>
      </div>

      {/* 分隔線 */}
      <div className="h-6 w-px bg-gray-200" />

      {/* 匯出 PNG */}
      <button
        type="button"
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => exportToPng(getNodes)}
      >
        匯出 PNG
      </button>

      {/* 分隔線 */}
      <div className="h-6 w-px bg-gray-200" />

      {/* 欄位設定 */}
      <button
        type="button"
        className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
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

      {showFieldSettings && (
        <FieldSettings onClose={() => setShowFieldSettings(false)} />
      )}
    </div>
  )
}
