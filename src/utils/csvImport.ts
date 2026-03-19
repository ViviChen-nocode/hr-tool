import type { OrgMember, FieldConfig } from '../types'

const KNOWN_HEADERS: Record<string, string> = {
  '姓名': 'name',
  '職稱': 'title',
  '部門': 'department',
  '上級': '_parent',
}

const DEFAULT_FIELD_CONFIGS: FieldConfig[] = [
  { key: 'name', label: '姓名', visible: true },
  { key: 'title', label: '職稱', visible: true },
  { key: 'department', label: '部門', visible: true },
]

function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        current += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        fields.push(current.trim())
        current = ''
      } else {
        current += ch
      }
    }
  }
  fields.push(current.trim())
  return fields
}

export interface CsvImportResult {
  members: OrgMember[]
  fieldConfigs: FieldConfig[]
}

export function parseCsv(text: string): CsvImportResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (lines.length < 2) {
    throw new Error('CSV 至少需要標題列和一筆資料')
  }

  const headers = parseCsvLine(lines[0])
  const nameIdx = headers.findIndex((h) => h === '姓名')
  if (nameIdx === -1) {
    throw new Error('CSV 必須包含「姓名」欄位')
  }

  // Map headers to field keys
  const headerMap = headers.map((h) => ({
    original: h,
    key: KNOWN_HEADERS[h] || null,
  }))

  // Build field configs including custom fields
  const fieldConfigs = [...DEFAULT_FIELD_CONFIGS]
  const customKeys: { index: number; key: string; label: string }[] = []

  headerMap.forEach((h, i) => {
    if (!h.key && h.original) {
      const key = `custom_${i}`
      customKeys.push({ index: i, key, label: h.original })
      fieldConfigs.push({ key, label: h.original, visible: true })
    }
  })

  // Parse rows into members (first pass: create all members)
  const rows = lines.slice(1)
  const members: OrgMember[] = []
  const parentNames: string[] = []

  for (const line of rows) {
    const fields = parseCsvLine(line)
    const name = fields[nameIdx]?.trim() ?? ''
    if (!name) continue

    const titleIdx = headerMap.findIndex((h) => h.key === 'title')
    const deptIdx = headerMap.findIndex((h) => h.key === 'department')
    const parentIdx = headerMap.findIndex((h) => h.key === '_parent')

    const customFields: Record<string, string> = {}
    for (const ck of customKeys) {
      const val = fields[ck.index]?.trim() ?? ''
      if (val) customFields[ck.key] = val
    }

    members.push({
      id: crypto.randomUUID(),
      name,
      title: titleIdx >= 0 ? (fields[titleIdx]?.trim() ?? '') : '',
      parentId: null, // resolve in second pass
      department: deptIdx >= 0 ? (fields[deptIdx]?.trim() ?? '') : '',
      customFields,
    })

    parentNames.push(
      parentIdx >= 0 ? (fields[parentIdx]?.trim() ?? '') : '',
    )
  }

  // Second pass: resolve parent names to IDs
  for (let i = 0; i < members.length; i++) {
    const pName = parentNames[i]
    if (pName) {
      const parent = members.find((m) => m.name === pName)
      if (parent) {
        members[i].parentId = parent.id
      }
    }
  }

  return { members, fieldConfigs }
}

export function generateTemplateCsv(): string {
  return '姓名,職稱,部門,上級\n王大明,執行長,經營層,\n李小華,技術長,技術部,王大明\n張美玲,人資主管,人資部,王大明\n陳志豪,前端工程師,技術部,李小華'
}

export function downloadCsv(content: string, filename: string) {
  const bom = '\uFEFF'
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
