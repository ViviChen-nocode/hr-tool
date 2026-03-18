import { useState } from 'react'

export default function MobileHint() {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('mobile-hint-dismissed') === '1',
  )

  if (dismissed) return null

  const handleDismiss = () => {
    sessionStorage.setItem('mobile-hint-dismissed', '1')
    setDismissed(true)
  }

  return (
    <div className="md:hidden w-full max-w-3xl mb-3 px-4">
      <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
        <span className="shrink-0">💻</span>
        <p className="flex-1">本工具建議使用電腦操作以獲得最佳體驗</p>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
          aria-label="關閉提示"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
