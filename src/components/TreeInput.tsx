import { useState, useCallback, useRef, useEffect } from 'react'
import { useOrgStore } from '../store/useOrgStore'
import type { OrgMember } from '../types'

function createEmptyMember(parentId: string | null = null): OrgMember {
  return {
    id: crypto.randomUUID(),
    name: '',
    title: '',
    parentId,
    department: '',
    customFields: {},
  }
}

/** Check if `ancestorId` is an ancestor of `memberId` */
function isDescendant(
  members: OrgMember[],
  memberId: string,
  ancestorId: string,
): boolean {
  const member = members.find((m) => m.id === memberId)
  if (!member || !member.parentId) return false
  if (member.parentId === ancestorId) return true
  return isDescendant(members, member.parentId, ancestorId)
}

interface TreeNodeProps {
  member: OrgMember
  members: OrgMember[]
  level: number
  editingId: string | null
  setEditingId: (id: string | null) => void
  dragOverId: string | null
  onDragStart: (id: string) => void
  onDragOver: (e: React.DragEvent, id: string) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent, targetId: string) => void
  onDragEnd: () => void
}

function TreeNode({
  member,
  members,
  level,
  editingId,
  setEditingId,
  dragOverId,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: TreeNodeProps) {
  const { addMember, updateMember, removeMember } = useOrgStore()
  const children = members.filter((m) => m.parentId === member.id)
  const [collapsed, setCollapsed] = useState(false)
  const [editData, setEditData] = useState({
    name: member.name,
    title: member.title,
    department: member.department,
  })
  const nameInputRef = useRef<HTMLInputElement>(null)
  const isEditing = editingId === member.id
  const isDragOver = dragOverId === member.id

  useEffect(() => {
    if (isEditing) {
      setEditData({
        name: member.name,
        title: member.title,
        department: member.department,
      })
      requestAnimationFrame(() => nameInputRef.current?.focus())
    }
  }, [isEditing, member.name, member.title, member.department])

  const saveEdit = useCallback(() => {
    updateMember(member.id, editData)
    setEditingId(null)
  }, [member.id, editData, updateMember, setEditingId])

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveEdit()
    }
    if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  const handleAddChild = () => {
    const newMember = createEmptyMember(member.id)
    addMember(newMember)
    setCollapsed(false)
    setEditingId(newMember.id)
  }

  const handleDelete = () => {
    removeMember(member.id)
    if (editingId === member.id) setEditingId(null)
  }

  const displayName = member.name.trim() || '（未命名）'
  const displayTitle = member.title.trim()

  return (
    <div className="select-none">
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move'
          onDragStart(member.id)
        }}
        onDragOver={(e) => onDragOver(e, member.id)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, member.id)}
        onDragEnd={onDragEnd}
        className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${
          isDragOver
            ? 'bg-blue-100 ring-2 ring-blue-400'
            : 'hover:bg-gray-50'
        }`}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        {/* Expand/collapse toggle */}
        <button
          type="button"
          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-gray-400 hover:text-gray-600 ${
            children.length === 0 ? 'invisible' : ''
          }`}
          onClick={() => setCollapsed(!collapsed)}
          tabIndex={-1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-90'}`}
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Content */}
        {isEditing ? (
          <div className="flex flex-1 items-center gap-2" onBlur={(e) => {
            // Save when focus leaves the edit container entirely
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              saveEdit()
            }
          }}>
            <input
              ref={nameInputRef}
              type="text"
              value={editData.name}
              placeholder="姓名"
              className="w-28 rounded border border-gray-200 px-2 py-1 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
              onKeyDown={handleEditKeyDown}
            />
            <input
              type="text"
              value={editData.title}
              placeholder="職稱"
              className="w-28 rounded border border-gray-200 px-2 py-1 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              onChange={(e) => setEditData((d) => ({ ...d, title: e.target.value }))}
              onKeyDown={handleEditKeyDown}
            />
            <input
              type="text"
              value={editData.department}
              placeholder="部門"
              className="w-28 rounded border border-gray-200 px-2 py-1 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              onChange={(e) => setEditData((d) => ({ ...d, department: e.target.value }))}
              onKeyDown={handleEditKeyDown}
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <span className="truncate text-sm font-medium text-gray-800">
              {displayName}
            </span>
            {displayTitle && (
              <span className="truncate text-sm text-gray-500">
                （{displayTitle}）
              </span>
            )}
          </div>
        )}

        {/* Action buttons — visible on hover */}
        {!isEditing && (
          <div className="flex flex-shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              className="rounded px-1.5 py-0.5 text-xs text-blue-600 hover:bg-blue-50"
              onClick={handleAddChild}
              title="新增子級"
            >
              +子級
            </button>
            <button
              type="button"
              className="rounded px-1.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
              onClick={() => setEditingId(member.id)}
              title="編輯"
            >
              編輯
            </button>
            <button
              type="button"
              className="rounded px-1.5 py-0.5 text-xs text-red-500 hover:bg-red-50"
              onClick={handleDelete}
              title="刪除"
            >
              刪除
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      {!collapsed &&
        children.map((child) => (
          <TreeNode
            key={child.id}
            member={child}
            members={members}
            level={level + 1}
            editingId={editingId}
            setEditingId={setEditingId}
            dragOverId={dragOverId}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
          />
        ))}
    </div>
  )
}

export default function TreeInput() {
  const { getCurrentChart, addMember, moveMember } = useOrgStore()
  const chart = getCurrentChart()
  const members = chart.members
  const rootMembers = members.filter((m) => m.parentId === null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (draggedId && targetId !== draggedId) {
        // Prevent dropping onto own descendant
        if (!isDescendant(members, targetId, draggedId)) {
          setDragOverId(targetId)
          return
        }
      }
      setDragOverId(null)
    },
    [draggedId, members],
  )

  const handleDragLeave = useCallback(() => {
    setDragOverId(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault()
      if (draggedId && targetId !== draggedId && !isDescendant(members, targetId, draggedId)) {
        moveMember(draggedId, targetId)
      }
      setDraggedId(null)
      setDragOverId(null)
    },
    [draggedId, members, moveMember],
  )

  const handleDragEnd = useCallback(() => {
    setDraggedId(null)
    setDragOverId(null)
  }, [])

  const handleAddRoot = () => {
    const newMember = createEmptyMember(null)
    addMember(newMember)
    setEditingId(newMember.id)
  }

  return (
    <div className="w-full">
      {/* Add root button */}
      <button
        type="button"
        className="mb-3 flex items-center gap-1 rounded px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50"
        onClick={handleAddRoot}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        新增根節點
      </button>

      {/* Tree */}
      {rootMembers.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400">
          尚無成員，請新增根節點
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 py-1">
          {rootMembers.map((member) => (
            <TreeNode
              key={member.id}
              member={member}
              members={members}
              level={0}
              editingId={editingId}
              setEditingId={setEditingId}
              dragOverId={dragOverId}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      )}

      <p className="mt-2 text-xs text-gray-400">
        拖曳節點到另一個節點上可調整階層關係
      </p>
    </div>
  )
}
