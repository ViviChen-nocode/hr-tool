import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OrgChart, OrgMember, FieldConfig } from '../types'

const DEFAULT_FIELD_CONFIGS: FieldConfig[] = [
  { key: 'name', label: '姓名', visible: true },
  { key: 'title', label: '職稱', visible: true },
  { key: 'department', label: '部門', visible: true },
]

function createEmptyChart(name = '未命名組織圖'): OrgChart {
  return {
    id: crypto.randomUUID(),
    name,
    members: [],
    fieldConfigs: DEFAULT_FIELD_CONFIGS.map((f) => ({ ...f })),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

interface OrgState {
  charts: OrgChart[]
  currentChartId: string

  // Chart actions
  addChart: (name?: string) => void
  switchChart: (id: string) => void
  deleteChart: (id: string) => void

  // Member actions
  addMember: (member: OrgMember) => void
  updateMember: (id: string, data: Partial<Omit<OrgMember, 'id'>>) => void
  removeMember: (id: string) => void
  moveMember: (id: string, newParentId: string | null) => void

  // Field config actions
  addField: (config: FieldConfig) => void
  removeField: (key: string) => void

  // Helpers
  getCurrentChart: () => OrgChart
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set, get) => {
      const initial = createEmptyChart()

      const updateCurrentChart = (
        updater: (chart: OrgChart) => Partial<OrgChart>,
      ) => {
        set((state) => ({
          charts: state.charts.map((c) =>
            c.id === state.currentChartId
              ? { ...c, ...updater(c), updatedAt: Date.now() }
              : c,
          ),
        }))
      }

      return {
        charts: [initial],
        currentChartId: initial.id,

        // Chart actions
        addChart: (name) => {
          const chart = createEmptyChart(name)
          set((state) => ({
            charts: [...state.charts, chart],
            currentChartId: chart.id,
          }))
        },

        switchChart: (id) => {
          const exists = get().charts.some((c) => c.id === id)
          if (exists) set({ currentChartId: id })
        },

        deleteChart: (id) => {
          const { charts, currentChartId } = get()
          if (charts.length <= 1) return // 至少保留一份
          const remaining = charts.filter((c) => c.id !== id)
          set({
            charts: remaining,
            currentChartId:
              currentChartId === id ? remaining[0].id : currentChartId,
          })
        },

        // Member actions
        addMember: (member) => {
          updateCurrentChart((chart) => ({
            members: [...chart.members, member],
          }))
        },

        updateMember: (id, data) => {
          updateCurrentChart((chart) => ({
            members: chart.members.map((m) =>
              m.id === id ? { ...m, ...data } : m,
            ),
          }))
        },

        removeMember: (id) => {
          updateCurrentChart((chart) => ({
            // 移除成員時，其子成員的 parentId 指向被移除者的 parent
            members: chart.members
              .filter((m) => m.id !== id)
              .map((m) =>
                m.parentId === id
                  ? {
                      ...m,
                      parentId:
                        chart.members.find((p) => p.id === id)?.parentId ??
                        null,
                    }
                  : m,
              ),
          }))
        },

        moveMember: (id, newParentId) => {
          updateCurrentChart((chart) => ({
            members: chart.members.map((m) =>
              m.id === id ? { ...m, parentId: newParentId } : m,
            ),
          }))
        },

        // Field config actions
        addField: (config) => {
          updateCurrentChart((chart) => ({
            fieldConfigs: [...chart.fieldConfigs, config],
          }))
        },

        removeField: (key) => {
          if (key === 'name') return // name 欄位不可移除
          updateCurrentChart((chart) => ({
            fieldConfigs: chart.fieldConfigs.filter((f) => f.key !== key),
          }))
        },

        // Helpers
        getCurrentChart: () => {
          const { charts, currentChartId } = get()
          return charts.find((c) => c.id === currentChartId)!
        },
      }
    },
    { name: 'org-store' },
  ),
)
