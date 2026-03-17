import { useRef } from 'react'
import { useStyleStore, THEME_PRESETS, generateThemeFromColor, type ThemeKey, type TextAlign } from '../store/useStyleStore'

type PresetThemeKey = Exclude<ThemeKey, 'custom'>

const THEME_OPTIONS: { key: PresetThemeKey; label: string }[] = [
  { key: 'blue', label: '藍色' },
  { key: 'green', label: '綠色' },
  { key: 'purple', label: '紫色' },
  { key: 'orange', label: '橘色' },
  { key: 'slate', label: '灰色' },
]

const ALIGN_OPTIONS: { key: TextAlign; label: string; icon: React.ReactNode }[] = [
  {
    key: 'left',
    label: '靠左',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h12M3 18h15" />
      </svg>
    ),
  },
  {
    key: 'center',
    label: '置中',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M4 18h16" />
      </svg>
    ),
  },
  {
    key: 'right',
    label: '靠右',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 12h12M6 18h15" />
      </svg>
    ),
  },
]

interface StyleSettingsProps {
  onClose: () => void
}

export default function StyleSettings({ onClose }: StyleSettingsProps) {
  const { theme, textAlign, cardWidth, customColor, setTheme, setTextAlign, setCardWidth, setCustomColor } = useStyleStore()
  const preset = theme === 'custom' ? generateThemeFromColor(customColor) : THEME_PRESETS[theme]
  const colorInputRef = useRef<HTMLInputElement>(null)

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
        <div
          className="flex items-center justify-between rounded-t-xl px-5 py-4"
          style={{
            background: `linear-gradient(135deg, ${preset.headerGradientFrom}, ${preset.headerGradientTo})`,
          }}
        >
          <h2 className="text-base font-semibold text-white">樣式設定</h2>
          <button
            type="button"
            className="rounded-md p-1 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
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

        <div className="px-5 py-5 space-y-6">
          {/* Theme color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">主題色</label>
            <div className="flex items-center gap-3 flex-wrap">
              {THEME_OPTIONS.map((opt) => {
                const p = THEME_PRESETS[opt.key]
                const isActive = theme === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    className="group flex flex-col items-center gap-1.5"
                    onClick={() => setTheme(opt.key)}
                    title={opt.label}
                  >
                    <div
                      className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150"
                      style={{
                        background: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})`,
                        boxShadow: isActive ? `0 0 0 3px ${p.accentLight}, 0 0 0 5px ${p.accent}` : 'none',
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {isActive && (
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs ${isActive ? 'font-medium text-gray-700' : 'text-gray-400'}`}>
                      {opt.label}
                    </span>
                  </button>
                )
              })}

              {/* Custom color picker */}
              <button
                type="button"
                className="group flex flex-col items-center gap-1.5"
                onClick={() => colorInputRef.current?.click()}
                title="自訂"
              >
                <div
                  className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150"
                  style={{
                    background: theme === 'custom'
                      ? customColor
                      : 'conic-gradient(#f44, #ff0, #0f0, #0ff, #00f, #f0f, #f44)',
                    boxShadow: theme === 'custom'
                      ? `0 0 0 3px ${preset.accentLight}, 0 0 0 5px ${preset.accent}`
                      : 'none',
                    transform: theme === 'custom' ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {theme === 'custom' ? (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${theme === 'custom' ? 'font-medium text-gray-700' : 'text-gray-400'}`}>
                  自訂
                </span>
              </button>
              <input
                ref={colorInputRef}
                type="color"
                className="invisible absolute h-0 w-0"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
              />
            </div>
          </div>

          {/* Text alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">卡片文字對齊</label>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {ALIGN_OPTIONS.map((opt) => {
                const isActive = textAlign === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    className="flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all duration-150"
                    style={{
                      backgroundColor: isActive ? preset.accentLight : 'transparent',
                      color: isActive ? preset.accent : '#6b7280',
                      borderRight: opt.key !== 'right' ? '1px solid #e5e7eb' : 'none',
                    }}
                    onClick={() => setTextAlign(opt.key)}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Card width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              卡片寬度
              <span className="ml-2 text-xs font-normal text-gray-400">{cardWidth}px</span>
            </label>
            <input
              type="range"
              min={120}
              max={300}
              step={10}
              value={cardWidth}
              onChange={(e) => setCardWidth(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: preset.accent }}
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>120</span>
              <span>300</span>
            </div>
          </div>

          {/* Preview card */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">預覽</label>
            <div className="flex justify-center rounded-lg bg-gray-50 p-6">
              <div style={{ width: `${cardWidth}px` }} className="rounded-lg border border-gray-200 bg-white shadow-md">
                <div
                  className="h-1.5 rounded-t-lg"
                  style={{
                    background: `linear-gradient(to right, ${preset.gradientFrom}, ${preset.gradientTo})`,
                  }}
                />
                <div className="px-4 py-3" style={{ textAlign }}>
                  <div className="text-sm font-bold text-gray-900">王小明</div>
                  <div
                    className="mt-1 mb-1.5"
                    style={{
                      height: '1px',
                      background: `linear-gradient(to right, transparent, ${preset.accent}30, transparent)`,
                    }}
                  />
                  <div className="text-xs font-medium text-gray-600">技術總監</div>
                  <div className="mt-0.5 text-xs text-gray-400">工程部</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
