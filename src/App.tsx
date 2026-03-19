import { useState, useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { useOrgStore } from './store/useOrgStore'
import { useStyleStore } from './store/useStyleStore'
import InputView from './components/InputView'
import EditorView from './components/EditorView'
import ChartSelector from './components/ChartSelector'
import FloatingMascot from './components/FloatingMascot'
import Footer from './components/Footer'

function App() {
  const view = useAppStore((s) => s.view)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const check = () => {
      if (useOrgStore.persist.hasHydrated() && useStyleStore.persist.hasHydrated()) {
        setHydrated(true)
      }
    }
    check()
    const unsub1 = useOrgStore.persist.onFinishHydration(check)
    const unsub2 = useStyleStore.persist.onFinishHydration(check)
    return () => { unsub1(); unsub2() }
  }, [])

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
