import { useAppStore } from './store/useAppStore'
import InputView from './components/InputView'

function EditorPlaceholder() {
  const setView = useAppStore((s) => s.setView)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800">編輯器（開發中）</h1>
      <button
        type="button"
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
        onClick={() => setView('input')}
      >
        返回輸入
      </button>
    </div>
  )
}

function App() {
  const view = useAppStore((s) => s.view)

  return view === 'input' ? <InputView /> : <EditorPlaceholder />
}

export default App
