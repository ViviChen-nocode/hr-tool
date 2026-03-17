import { toPng } from 'html-to-image'
import { getNodesBounds, getViewportForBounds, type Node } from '@xyflow/react'

const IMAGE_WIDTH = 4096
const IMAGE_HEIGHT = 4096
const PIXEL_RATIO = 2

export async function exportToPng(getNodes: () => Node[]): Promise<void> {
  const viewportEl = document.querySelector<HTMLElement>('.react-flow__viewport')
  if (!viewportEl) return

  const nodes = getNodes()
  if (nodes.length === 0) return

  const bounds = getNodesBounds(nodes)

  // Add padding around the bounds
  const padding = 50
  const paddedBounds = {
    x: bounds.x - padding,
    y: bounds.y - padding,
    width: bounds.width + padding * 2,
    height: bounds.height + padding * 2,
  }

  // Calculate image dimensions maintaining aspect ratio
  const aspectRatio = paddedBounds.width / paddedBounds.height
  let imageWidth: number
  let imageHeight: number

  if (aspectRatio > 1) {
    imageWidth = IMAGE_WIDTH
    imageHeight = Math.round(IMAGE_WIDTH / aspectRatio)
  } else {
    imageHeight = IMAGE_HEIGHT
    imageWidth = Math.round(IMAGE_HEIGHT * aspectRatio)
  }

  const viewport = getViewportForBounds(
    paddedBounds,
    imageWidth,
    imageHeight,
    0.5,
    2,
    0,
  )

  const dataUrl = await toPng(viewportEl, {
    backgroundColor: '#ffffff',
    width: imageWidth,
    height: imageHeight,
    pixelRatio: PIXEL_RATIO,
    style: {
      width: `${imageWidth}px`,
      height: `${imageHeight}px`,
      transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
    },
  })

  const link = document.createElement('a')
  link.download = 'org-chart.png'
  link.href = dataUrl
  link.click()
}
