import { useAppStore } from './store/useAppStore'
import InputView from './components/InputView'
import EditorView from './components/EditorView'
import ChartSelector from './components/ChartSelector'

function App() {
  const view = useAppStore((s) => s.view)

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <ChartSelector />
      <div className="flex-1 overflow-hidden">
        {view === 'input' ? <InputView /> : <EditorView />}
      </div>
    </div>
  )
}

export default App
