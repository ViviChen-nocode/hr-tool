import { useRef, useCallback, useEffect } from 'react'
import { useOrgStore } from '../store/useOrgStore'
import type { OrgMember, FieldConfig } from '../types'

const DEFAULT_KEYS = new Set(['name', 'title', 'department'])

function createEmptyMember(): OrgMember {
  return {
    id: crypto.randomUUID(),
    name: '',
    title: '',
    parentId: null,
    department: '',
    customFields: {},
  }
}

export default function TableInput() {
  const { getCurrentChart, addMember, updateMember, removeMember } =
    useOrgStore()
  const chart = getCurrentChart()
  const members = chart.members
  const fieldConfigs = chart.fieldConfigs
  const customFields: FieldConfig[] = fieldConfigs.filter(
    (f) => !DEFAULT_KEYS.has(f.key),
  )
  const nameInputRefs = useRef<Map<string, HTMLInputElement>>(new Map())

  // Ensure at least one row
  useEffect(() => {
    if (members.length === 0) {
      addMember(createEmptyMember())
    }
  }, [members.length, addMember])

  const namedMembers = members.filter((m) => m.name.trim() !== '')

  if (members.length === 0) return null

  const handleAddRow = useCallback(() => {
    const newMember = createEmptyMember()
    addMember(newMember)
    // Focus the name input of the new row after render
    requestAnimationFrame(() => {
      const input = nameInputRefs.current.get(newMember.id)
      input?.focus()
    })
  }, [addMember])

  const handleKeyDown = (
    e: React.KeyboardEvent,
    member: OrgMember,
    field: string,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const isLastRow = members[members.length - 1].id === member.id
      if (isLastRow) {
        handleAddRow()
      } else {
        // Move focus to the same field in the next row
        const currentIndex = members.findIndex((m) => m.id === member.id)
        const nextMember = members[currentIndex + 1]
        if (nextMember && field === 'name') {
          const input = nameInputRefs.current.get(nextMember.id)
          input?.focus()
        }
      }
    }
  }

  const handleRemoveRow = (id: string) => {
    if (members.length <= 1) return
    removeMember(id)
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">
                姓名
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">
                職稱
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">
                上級
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">
                部門
              </th>
              {customFields.map((field) => (
                <th
                  key={field.key}
                  className="px-3 py-2 text-left text-sm font-medium text-gray-500"
                >
                  {field.label}
                </th>
              ))}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-3 py-1.5">
                  <input
                    ref={(el) => {
                      if (el) nameInputRefs.current.set(member.id, el)
                      else nameInputRefs.current.delete(member.id)
                    }}
                    type="text"
                    value={member.name}
                    placeholder="輸入姓名"
                    className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    onChange={(e) =>
                      updateMember(member.id, { name: e.target.value })
                    }
                    onKeyDown={(e) => handleKeyDown(e, member, 'name')}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="text"
                    value={member.title}
                    placeholder="輸入職稱"
                    className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    onChange={(e) =>
                      updateMember(member.id, { title: e.target.value })
                    }
                    onKeyDown={(e) => handleKeyDown(e, member, 'title')}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={member.parentId ?? ''}
                    className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    onChange={(e) =>
                      updateMember(member.id, {
                        parentId: e.target.value || null,
                      })
                    }
                  >
                    <option value="">無（最上層）</option>
                    {namedMembers
                      .filter((m) => m.id !== member.id)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="text"
                    value={member.department}
                    placeholder="輸入部門"
                    className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    onChange={(e) =>
                      updateMember(member.id, { department: e.target.value })
                    }
                    onKeyDown={(e) => handleKeyDown(e, member, 'department')}
                  />
                </td>
                {customFields.map((field) => (
                  <td key={field.key} className="px-3 py-1.5">
                    <input
                      type="text"
                      value={member.customFields?.[field.key] ?? ''}
                      placeholder={field.label}
                      className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      onChange={(e) =>
                        updateMember(member.id, {
                          customFields: {
                            ...member.customFields,
                            [field.key]: e.target.value,
                          },
                        })
                      }
                    />
                  </td>
                ))}
                <td className="px-1 py-1.5 text-center">
                  <button
                    type="button"
                    disabled={members.length <= 1}
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                    onClick={() => handleRemoveRow(member.id)}
                    title="刪除此列"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="mt-3 flex items-center gap-1 rounded px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50"
        onClick={handleAddRow}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        新增一列
      </button>
    </div>
  )
}
