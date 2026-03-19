import { useSyncExternalStore } from 'react'
import { useAppStore } from './store/useAppStore'
import { useOrgStore } from './store/useOrgStore'
import { useStyleStore } from './store/useStyleStore'
import InputView from './components/InputView'
import EditorView from './components/EditorView'
import ChartSelector from './components/ChartSelector'
import FloatingMascot from './components/FloatingMascot'
import Footer from './components/Footer'

function useHydrated() {
  const orgHydrated = useSyncExternalStore(
    useOrgStore.persist.onFinishHydration,
    () => useOrgStore.persist.hasHydrated(),
    () => false,
  )
  const styleHydrated = useSyncExternalStore(
    useStyleStore.persist.onFinishHydration,
    () => useStyleStore.persist.hasHydrated(),
    () => false,
  )
  return orgHydrated && styleHydrated
}

function App() {
  const view = useAppStore((s) => s.view)
  const hydrated = useHydrated()

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
