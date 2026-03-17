import { useMemo } from 'react'
import { ReactFlow, Controls, MiniMap, type NodeTypes } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useOrgStore } from '../store/useOrgStore'
import { useAppStore } from '../store/useAppStore'
import { buildLayout } from '../utils/layoutEngine'
import OrgNode from './OrgNode'

const nodeTypes: NodeTypes = { orgNode: OrgNode }

export default function OrgChartCanvas() {
  const getCurrentChart = useOrgStore((s) => s.getCurrentChart)
  const direction = useAppStore((s) => s.layoutDirection)
  const horizontalSpacing = useAppStore((s) => s.horizontalSpacing)
  const verticalSpacing = useAppStore((s) => s.verticalSpacing)

  const chart = getCurrentChart()

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

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
