import { useMemo, useState, useCallback, useRef } from 'react'
import {
  ReactFlow,
  Controls,
  MiniMap,
  type NodeTypes,
  type Node,
  type OnNodeDrag,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useOrgStore } from '../store/useOrgStore'
import { useAppStore } from '../store/useAppStore'
import { buildLayout } from '../utils/layoutEngine'
import OrgNode from './OrgNode'

const nodeTypes: NodeTypes = { orgNode: OrgNode }

/** Check if `candidateChildId` is an ancestor of `nodeId` (would create a cycle). */
function isAncestor(
  nodeId: string,
  candidateChildId: string,
  members: { id: string; parentId: string | null }[],
): boolean {
  let current = nodeId
  const visited = new Set<string>()
  while (current) {
    if (visited.has(current)) return false // safety: broken chain
    visited.add(current)
    const member = members.find((m) => m.id === current)
    if (!member?.parentId) return false
    if (member.parentId === candidateChildId) return true
    current = member.parentId
  }
  return false
}

const DROP_DISTANCE = 120 // px — how close a node must be to count as "over" another

export default function OrgChartCanvas() {
  const chart = useOrgStore((s) => s.getCurrentChart())
  const moveMember = useOrgStore((s) => s.moveMember)
  const direction = useAppStore((s) => s.layoutDirection)
  const horizontalSpacing = useAppStore((s) => s.horizontalSpacing)
  const verticalSpacing = useAppStore((s) => s.verticalSpacing)

  const { nodes, edges } = useMemo(
    () =>
      buildLayout({
        members: chart.members,
        fieldConfigs: chart.fieldConfigs,
        direction,
        horizontalSpacing,
        verticalSpacing,
      }),
    [chart.members, chart.fieldConfigs, direction, horizontalSpacing, verticalSpacing],
  )

  // --- drag-to-reparent state ---
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const dragNodeIdRef = useRef<string | null>(null)

  const findClosestNode = useCallback(
    (draggedNode: Node, allNodes: Node[]): string | null => {
      const dragX = draggedNode.position.x + 90 // approximate center
      const dragY = draggedNode.position.y + 40

      let closestId: string | null = null
      let closestDist = DROP_DISTANCE

      for (const node of allNodes) {
        if (node.id === draggedNode.id) continue
        const nx = node.position.x + 90
        const ny = node.position.y + 40
        const dist = Math.sqrt((dragX - nx) ** 2 + (dragY - ny) ** 2)
        if (dist < closestDist) {
          // Prevent circular reference
          if (!isAncestor(node.id, draggedNode.id, chart.members)) {
            closestDist = dist
            closestId = node.id
          }
        }
      }
      return closestId
    },
    [chart.members],
  )

  const onNodeDragStart: OnNodeDrag = useCallback((_event, node) => {
    dragNodeIdRef.current = node.id
  }, [])

  const onNodeDrag: OnNodeDrag = useCallback(
    (_event, node) => {
      const targetId = findClosestNode(node, nodes)
      setDropTargetId(targetId)
    },
    [nodes, findClosestNode],
  )

  const onNodeDragStop: OnNodeDrag = useCallback(
    (_event, _node) => {
      if (dropTargetId && dragNodeIdRef.current) {
        const draggedId = dragNodeIdRef.current
        if (draggedId !== dropTargetId) {
          moveMember(draggedId, dropTargetId)
        }
      }
      setDropTargetId(null)
      dragNodeIdRef.current = null
    },
    [dropTargetId, moveMember],
  )

  // Apply drop-target highlight by adding a className
  const styledNodes = useMemo(() => {
    if (!dropTargetId) return nodes
    return nodes.map((n) =>
      n.id === dropTargetId ? { ...n, className: 'drop-target-highlight' } : n,
    )
  }, [nodes, dropTargetId])

  return (
    <div className="h-full w-full">
      <style>{`
        .react-flow__node.drop-target-highlight > div {
          border-color: #3b82f6 !important;
          border-width: 2px !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
        }
      `}</style>
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
      >
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
