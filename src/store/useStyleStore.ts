import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeKey = 'blue' | 'green' | 'purple' | 'orange' | 'slate' | 'custom'
export type TextAlign = 'left' | 'center' | 'right'

export interface ThemePreset {
  accent: string
  accentHover: string
  accentLight: string      // light tint for backgrounds
  gradientFrom: string
  gradientTo: string
  headerGradientFrom: string
  headerGradientTo: string
}

export const THEME_PRESETS: Record<Exclude<ThemeKey, 'custom'>, ThemePreset> = {
  blue: {
    accent: '#3b82f6',
    accentHover: '#2563eb',
    accentLight: '#eff6ff',
    gradientFrom: '#3b82f6',
    gradientTo: '#60a5fa',
    headerGradientFrom: '#1e40af',
    headerGradientTo: '#3b82f6',
  },
  green: {
    accent: '#10b981',
    accentHover: '#059669',
    accentLight: '#ecfdf5',
    gradientFrom: '#10b981',
    gradientTo: '#34d399',
    headerGradientFrom: '#065f46',
    headerGradientTo: '#10b981',
  },
  purple: {
    accent: '#8b5cf6',
    accentHover: '#7c3aed',
    accentLight: '#f5f3ff',
    gradientFrom: '#8b5cf6',
    gradientTo: '#a78bfa',
    headerGradientFrom: '#5b21b6',
    headerGradientTo: '#8b5cf6',
  },
  orange: {
    accent: '#f59e0b',
    accentHover: '#d97706',
    accentLight: '#fffbeb',
    gradientFrom: '#f59e0b',
    gradientTo: '#fbbf24',
    headerGradientFrom: '#92400e',
    headerGradientTo: '#f59e0b',
  },
  slate: {
    accent: '#64748b',
    accentHover: '#475569',
    accentLight: '#f8fafc',
    gradientFrom: '#64748b',
    gradientTo: '#94a3b8',
    headerGradientFrom: '#1e293b',
    headerGradientTo: '#64748b',
  },
}

// --- Color utility helpers ---
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0')
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
}

export function generateThemeFromColor(hex: string): ThemePreset {
  const [h, s, l] = hexToHsl(hex)
  return {
    accent: hex,
    accentHover: hslToHex(h, s, Math.max(l - 10, 5)),
    accentLight: hslToHex(h, s, Math.min(l + 35, 95)),
    gradientFrom: hex,
    gradientTo: hslToHex(h, Math.max(s - 5, 0), Math.min(l + 10, 90)),
    headerGradientFrom: hslToHex(h, Math.max(s - 10, 0), Math.max(l - 25, 5)),
    headerGradientTo: hex,
  }
}

interface StyleState {
  theme: ThemeKey
  textAlign: TextAlign
  cardWidth: number
  customColor: string   // hex for the custom theme

  setTheme: (theme: ThemeKey) => void
  setTextAlign: (align: TextAlign) => void
  setCardWidth: (width: number) => void
  setCustomColor: (hex: string) => void
  getPreset: () => ThemePreset
}

export const useStyleStore = create<StyleState>()(
  persist(
    (set, get) => ({
      theme: 'blue',
      textAlign: 'center',
      cardWidth: 180,
      customColor: '#e11d48',

      setTheme: (theme) => set({ theme }),
      setTextAlign: (textAlign) => set({ textAlign }),
      setCardWidth: (cardWidth) => set({ cardWidth: Math.min(300, Math.max(120, cardWidth)) }),
      setCustomColor: (hex) => set({ customColor: hex, theme: 'custom' }),
      getPreset: () => {
        const { theme, customColor } = get()
        if (theme === 'custom') return generateThemeFromColor(customColor)
        return THEME_PRESETS[theme]
      },
    }),
    { name: 'style-store' },
  ),
)
