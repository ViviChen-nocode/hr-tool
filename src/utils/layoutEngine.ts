import dagre from 'dagre'
import type { Node, Edge } from '@xyflow/react'
import type { OrgMember, FieldConfig, LayoutDirection } from '../types'
import { useStyleStore } from '../store/useStyleStore'

interface LayoutOptions {
  members: OrgMember[]
  fieldConfigs: FieldConfig[]
  direction: LayoutDirection
  horizontalSpacing: number
  verticalSpacing: number
}

interface LayoutResult {
  nodes: Node[]
  edges: Edge[]
}

const NODE_HEIGHT = 80

export function buildLayout(options: LayoutOptions): LayoutResult {
  const { members, fieldConfigs, direction, horizontalSpacing, verticalSpacing } = options
  const NODE_WIDTH = useStyleStore.getState().cardWidth + 20 // add some padding for dagre

  if (members.length === 0) {
    return { nodes: [], edges: [] }
  }

  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: direction,
    nodesep: horizontalSpacing,
    ranksep: verticalSpacing,
  })

  // Add nodes
  for (const member of members) {
    g.setNode(member.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }

  // Add edges (parent -> child)
  for (const member of members) {
    if (member.parentId && members.some((m) => m.id === member.parentId)) {
      g.setEdge(member.parentId, member.id)
    }
  }

  dagre.layout(g)

  const nodes: Node[] = members.map((member) => {
    const pos = g.node(member.id)
    return {
      id: member.id,
      type: 'orgNode',
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
      data: { member, fieldConfigs },
    }
  })

  const edges: Edge[] = members
    .filter((m) => m.parentId && members.some((p) => p.id === m.parentId))
    .map((member) => ({
      id: `e-${member.parentId}-${member.id}`,
      source: member.parentId!,
      target: member.id,
      type: 'smoothstep',
    }))

  return { nodes, edges }
}
