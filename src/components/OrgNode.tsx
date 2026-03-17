import { useState, useRef, useEffect, useCallback } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { OrgMember, FieldConfig } from '../types'
import { useAppStore } from '../store/useAppStore'
import { useOrgStore } from '../store/useOrgStore'
import { useStyleStore } from '../store/useStyleStore'

type OrgNodeData = {
  member: OrgMember
  fieldConfigs: FieldConfig[]
}

export default function OrgNode({ data }: NodeProps) {
  const direction = useAppStore((s) => s.layoutDirection)
  const updateMember = useOrgStore((s) => s.updateMember)
  const { textAlign, cardWidth } = useStyleStore()
  const preset = useStyleStore((s) => s.getPreset())
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
        className="rounded-lg border-2 bg-white shadow-lg overflow-hidden"
        style={{ borderColor: preset.accent, width: `${cardWidth}px` }}
        onKeyDown={handleKeyDown}
      >
        <div
          className="h-1.5"
          style={{ background: `linear-gradient(to right, ${preset.gradientFrom}, ${preset.gradientTo})` }}
        />
        <div className="px-3 py-2">
        <Handle type="target" position={targetPosition} className="!bg-gray-400" />

        <input
          autoFocus
          className="w-full rounded border border-gray-300 px-1.5 py-0.5 text-sm font-bold text-gray-900 outline-none focus:ring-1"
          style={{ '--tw-ring-color': preset.accent, borderColor: undefined } as React.CSSProperties}
          value={draft.name}
          onChange={(e) => updateDraftField('name', e.target.value)}
          placeholder="姓名"
          onFocus={(e) => { e.target.style.borderColor = preset.accent }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
        />

        {visibleFields.map((field) => (
          <input
            key={field.key}
            className="mt-1 w-full rounded border border-gray-300 px-1.5 py-0.5 text-xs text-gray-600 outline-none focus:ring-1"
            value={getDraftValue(field.key)}
            onChange={(e) => updateDraftField(field.key, e.target.value)}
            placeholder={field.label}
            onFocus={(e) => { e.target.style.borderColor = preset.accent }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
          />
        ))}

        <div className="mt-1.5 flex gap-1 text-[10px]">
          <button
            className="rounded px-2 py-0.5 text-white transition-colors"
            style={{ backgroundColor: preset.accent }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = preset.accentHover }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = preset.accent }}
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
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="rounded-lg border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer group overflow-hidden"
      style={{
        width: `${cardWidth}px`,
        borderColor: '#e5e7eb',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${preset.accent}60` }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb' }}
      onDoubleClick={startEditing}
    >
      <Handle type="target" position={targetPosition} className="!bg-gray-400" />

      {/* Top accent bar */}
      <div
        className="h-1.5 rounded-t-lg"
        style={{
          background: `linear-gradient(to right, ${preset.gradientFrom}, ${preset.gradientTo})`,
        }}
      />

      <div className="px-4 py-3" style={{ textAlign }}>
        <div className="text-sm font-bold text-gray-900 leading-snug">
          {member.name || '（未命名）'}
        </div>

        {visibleFields.length > 0 && (
          <div
            className="my-1.5"
            style={{
              height: '1px',
              background: `linear-gradient(to right, transparent, ${preset.accent}25, transparent)`,
            }}
          />
        )}

        {visibleFields.map((field) => {
          const value = getFieldValue(field.key)
          if (!value) return null

          // Title gets special styling
          if (field.key === 'title') {
            return (
              <div key={field.key} className="text-xs font-medium text-gray-600">
                {value}
              </div>
            )
          }

          // Department and other fields
          return (
            <div key={field.key} className="mt-0.5 text-xs text-gray-400">
              {value}
            </div>
          )
        })}

        <div className="mt-1 text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          雙擊編輯
        </div>
      </div>

      <Handle type="source" position={sourcePosition} className="!bg-gray-400" />
    </div>
  )
}
