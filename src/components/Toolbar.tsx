import { useReactFlow } from '@xyflow/react'
import { useAppStore } from '../store/useAppStore'

export default function Toolbar() {
  const {
    layoutDirection,
    setLayoutDirection,
    horizontalSpacing,
    setHorizontalSpacing,
    verticalSpacing,
    setVerticalSpacing,
  } = useAppStore()

  const { zoomIn, zoomOut, fitView } = useReactFlow()

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
        onClick={() => {
          // TODO: 匯出 PNG 功能
        }}
      >
        匯出 PNG
      </button>
    </div>
  )
}
