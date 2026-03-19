import { useState, useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { useOrgStore } from './store/useOrgStore'
import { useStyleStore } from './store/useStyleStore'
import InputView from './components/InputView'
import EditorView from './components/EditorView'
import ChartSelector from './components/ChartSelector'
import FloatingMascot from './components/FloatingMascot'
import Footer from './components/Footer'

function useHydration() {
  const [hydrated, setHydrated] = useState(
    () => useOrgStore.persist.hasHydrated() && useStyleStore.persist.hasHydrated(),
  )

  useEffect(() => {
    if (hydrated) return

    const unsubs: (() => void)[] = []

    const check = () => {
      if (useOrgStore.persist.hasHydrated() && useStyleStore.persist.hasHydrated()) {
        setHydrated(true)
      }
    }

    unsubs.push(useOrgStore.persist.onFinishHydration(check))
    unsubs.push(useStyleStore.persist.onFinishHydration(check))

    // fallback: 如果 hydration 已經完成但 callback 沒觸發
    check()

    // 最終保底：500ms 後強制渲染
    const timer = setTimeout(() => setHydrated(true), 500)

    return () => {
      unsubs.forEach((fn) => fn())
      clearTimeout(timer)
    }
  }, [hydrated])

  return hydrated
}

function App() {
  const view = useAppStore((s) => s.view)
  const hydrated = useHydration()

  if (!hydrated) return null

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <ChartSelector />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          {view === 'input' ? <InputView /> : <EditorView />}
        </div>
        {view === 'input' && <Footer />}
      </div>
      <FloatingMascot />
    </div>
  )
}

export default App
