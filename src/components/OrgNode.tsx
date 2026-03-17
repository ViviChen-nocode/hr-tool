import { useState, useRef, useEffect, useCallback } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { OrgMember, FieldConfig } from '../types'
import { useAppStore } from '../store/useAppStore'
import { useOrgStore } from '../store/useOrgStore'

type OrgNodeData = {
  member: OrgMember
  fieldConfigs: FieldConfig[]
}

export default function OrgNode({ data }: NodeProps) {
  const direction = useAppStore((s) => s.layoutDirection)
  const updateMember = useOrgStore((s) => s.updateMember)
  const { member, fieldConfigs } = data as unknown as OrgNodeData

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<{
    name: string
    title: string
    department: string
    customFields: Record<string, string>
  }>({ name: '', title: '', department: '', customFields: {} })

  const containerRef = useRef<HTMLDivElement>(null)

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

  const startEditing = useCallback(() => {
    setDraft({
      name: member.name,
      title: member.title,
      department: member.department,
      customFields: { ...member.customFields },
    })
    setEditing(true)
  }, [member])

  const save = useCallback(() => {
    updateMember(member.id, {
      name: draft.name,
      title: draft.title,
      department: draft.department,
      customFields: draft.customFields,
    })
    setEditing(false)
  }, [draft, member.id, updateMember])

  const cancel = useCallback(() => {
    setEditing(false)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        save()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        cancel()
      }
    },
    [save, cancel],
  )

  // Click outside to save
  useEffect(() => {
    if (!editing) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        save()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [editing, save])

  const updateDraftField = (key: string, value: string) => {
    if (key === 'name') setDraft((d) => ({ ...d, name: value }))
    else if (key === 'title') setDraft((d) => ({ ...d, title: value }))
    else if (key === 'department') setDraft((d) => ({ ...d, department: value }))
    else setDraft((d) => ({ ...d, customFields: { ...d.customFields, [key]: value } }))
  }

  const getDraftValue = (key: string): string => {
    if (key === 'title') return draft.title
    if (key === 'department') return draft.department
    return draft.customFields?.[key] ?? ''
  }

  if (editing) {
    return (
      <div
        ref={containerRef}
        className="min-w-[200px] rounded-lg border-2 border-blue-400 bg-white px-4 py-3 shadow-lg"
        onKeyDown={handleKeyDown}
      >
        <Handle type="target" position={targetPosition} className="!bg-gray-400" />

        <input
          autoFocus
          className="w-full rounded border border-gray-300 px-1.5 py-0.5 text-sm font-bold text-gray-900 outline-none focus:border-blue-500"
          value={draft.name}
          onChange={(e) => updateDraftField('name', e.target.value)}
          placeholder="姓名"
        />

        {visibleFields.map((field) => (
          <input
            key={field.key}
            className="mt-1 w-full rounded border border-gray-300 px-1.5 py-0.5 text-xs text-gray-600 outline-none focus:border-blue-500"
            value={getDraftValue(field.key)}
            onChange={(e) => updateDraftField(field.key, e.target.value)}
            placeholder={field.label}
          />
        ))}

        <div className="mt-1.5 flex gap-1 text-[10px]">
          <button
            className="rounded bg-blue-500 px-2 py-0.5 text-white hover:bg-blue-600"
            onClick={save}
          >
            儲存
          </button>
          <button
            className="rounded bg-gray-200 px-2 py-0.5 text-gray-600 hover:bg-gray-300"
            onClick={cancel}
          >
            取消
          </button>
        </div>

        <Handle type="source" position={sourcePosition} className="!bg-gray-400" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="min-w-[180px] rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-md transition-colors"
      onDoubleClick={startEditing}
    >
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
