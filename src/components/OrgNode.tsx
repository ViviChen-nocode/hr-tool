import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { OrgMember, FieldConfig } from '../types'
import { useAppStore } from '../store/useAppStore'

type OrgNodeData = {
  member: OrgMember
  fieldConfigs: FieldConfig[]
}

export default function OrgNode({ data }: NodeProps) {
  const direction = useAppStore((s) => s.layoutDirection)
  const { member, fieldConfigs } = data as unknown as OrgNodeData

  const visibleFields = (fieldConfigs as FieldConfig[]).filter(
    (f) => f.visible && f.key !== 'name',
  )

  const sourcePosition = direction === 'TB' ? Position.Bottom : Position.Right
  const targetPosition = direction === 'TB' ? Position.Top : Position.Left

  const getFieldValue = (key: string): string => {
    if (key === 'title') return member.title
    if (key === 'department') return member.department
    return member.customFields?.[key] ?? ''
  }

  return (
    <div className="min-w-[180px] rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-md">
      <Handle type="target" position={targetPosition} className="!bg-gray-400" />

      <div className="text-sm font-bold text-gray-900">{member.name || '（未命名）'}</div>

      {visibleFields.map((field) => {
        const value = getFieldValue(field.key)
        if (!value) return null
        return (
          <div key={field.key} className="mt-0.5 text-xs text-gray-500">
            {value}
          </div>
        )
      })}

      <Handle type="source" position={sourcePosition} className="!bg-gray-400" />
    </div>
  )
}
