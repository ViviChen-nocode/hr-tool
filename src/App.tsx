import { useAppStore } from './store/useAppStore'
import InputView from './components/InputView'
import EditorView from './components/EditorView'

function App() {
  const view = useAppStore((s) => s.view)

  return view === 'input' ? <InputView /> : <EditorView />
}

export default App
