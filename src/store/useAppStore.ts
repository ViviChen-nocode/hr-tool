import { create } from 'zustand'
import type { AppView, InputMode, LayoutDirection } from '../types'

interface AppState {
  view: AppView
  inputMode: InputMode
  layoutDirection: LayoutDirection
  horizontalSpacing: number
  verticalSpacing: number

  setView: (view: AppView) => void
  setInputMode: (mode: InputMode) => void
  setLayoutDirection: (dir: LayoutDirection) => void
  setHorizontalSpacing: (spacing: number) => void
  setVerticalSpacing: (spacing: number) => void
}

export const useAppStore = create<AppState>()((set) => ({
  view: 'input',
  inputMode: 'table',
  layoutDirection: 'TB',
  horizontalSpacing: 100,
  verticalSpacing: 100,

  setView: (view) => set({ view }),
  setInputMode: (inputMode) => set({ inputMode }),
  setLayoutDirection: (layoutDirection) => set({ layoutDirection }),
  setHorizontalSpacing: (horizontalSpacing) => set({ horizontalSpacing }),
  setVerticalSpacing: (verticalSpacing) => set({ verticalSpacing }),
}))
