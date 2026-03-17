export interface OrgMember {
  id: string
  name: string
  title: string
  parentId: string | null
  department: string
  customFields: Record<string, string>
}

export interface FieldConfig {
  key: string
  label: string
  visible: boolean // 是否在卡片上顯示
}

export interface OrgChart {
  id: string
  name: string
  members: OrgMember[]
  fieldConfigs: FieldConfig[]
  createdAt: number
  updatedAt: number
}

export type AppView = 'input' | 'editor'
export type InputMode = 'table' | 'tree'
export type LayoutDirection = 'TB' | 'LR'
