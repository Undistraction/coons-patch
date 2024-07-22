import { isArray } from '../../../src/utils/types'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

const getCanvasApi = (context) => {
  const drawDot = ({ x, y }, { color = 'black', size = 2, text } = {}) => {
    context.beginPath()
    context.moveTo(x, y)
    context.arc(x, y, size, 0, Math.PI * 2)
    context.fillStyle = color
    context.fill()
    if (text) {
      context.fillStyle = 'black'
      context.fillText(text, x, y)
    }
  }

  const drawCurve = (
    { controlPoint1, controlPoint2, startPoint, endPoint },
    { color = 'red', lineWidth = 1 } = {}
  ) => {
    context.beginPath()
    context.moveTo(startPoint.x, startPoint.y)

    // Draw curve from point 0 to point 1
    context.bezierCurveTo(
      controlPoint1.x,
      controlPoint1.y,
      controlPoint2.x,
      controlPoint2.y,
      endPoint.x,
      endPoint.y
    )

    context.strokeStyle = color
    context.lineWidth = lineWidth
    context.stroke()
  }

  const drawQuad = (lines, { color = 'green', lineWidth = 1 } = {}) => {
    context.beginPath()
    context.moveTo(lines.top.startPoint.x, lines.top.startPoint.y)

    // Draw Top (left to right)
    context.bezierCurveTo(
      lines.top.controlPoint1.x,
      lines.top.controlPoint1.y,
      lines.top.controlPoint2.x,
      lines.top.controlPoint2.y,
      lines.top.endPoint.x,
      lines.top.endPoint.y
    )

    // Draw Right (top to bottom)
    context.bezierCurveTo(
      lines.right.controlPoint1.x,
      lines.right.controlPoint1.y,
      lines.right.controlPoint2.x,
      lines.right.controlPoint2.y,
      lines.right.endPoint.x,
      lines.right.endPoint.y
    )

    // Draw Bottom (right to left) note the changed order as the line is
    // defined left to right and we are drawing right to left
    context.bezierCurveTo(
      lines.bottom.controlPoint2.x,
      lines.bottom.controlPoint2.y,
      lines.bottom.controlPoint1.x,
      lines.bottom.controlPoint1.y,
      lines.bottom.startPoint.x,
      lines.bottom.startPoint.y
    )

    // Draw Left (bottom to top) note the changed order as the line is
    // defined top to bottom and we are drawing bottom to top
    context.bezierCurveTo(
      lines.left.controlPoint2.x,
      lines.left.controlPoint2.y,
      lines.left.controlPoint1.x,
      lines.left.controlPoint1.y,
      lines.left.startPoint.x,
      lines.left.startPoint.y
    )

    context.closePath()
    context.strokeStyle = color
    context.lineWidth = lineWidth
    context.stroke()
  }

  const drawPatchBounds = (
    lines,
    { lineColor = 'green', lineWidth = 3 } = {}
  ) => {
    drawQuad(lines, { color: lineColor, lineWidth })
  }

  const drawBounds = (lines, { lineColor = 'black', lineWidth = 3 } = {}) => {
    drawQuad(lines, { color: lineColor, lineWidth })

    // Draw control point stems
    const edges = [lines.top, lines.bottom, lines.left, lines.right]

    edges.map(({ startPoint, endPoint, controlPoint1, controlPoint2 }) => {
      drawLine(startPoint, controlPoint1)
      drawLine(endPoint, controlPoint2)
    })
  }

  const drawLine = (startPoint, endPoint, { color = 'grey' } = {}) => {
    context.beginPath()
    context.moveTo(startPoint.x, startPoint.y)
    context.lineTo(endPoint.x, endPoint.y)
    context.strokeStyle = color
    context.lineWidth = 1
    context.stroke()
  }

  const clearCanvas = (canvas) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const drawGridCurve = (curve, { lineColor = 'black' }) => {
    // if (curve.original) {
    //   const { original } = curve
    //   drawDot(original.startPoint, { color: `red`, size: 12 })
    //   drawDot(original.endPoint, { color: `blue`, size: 12 })
    //   drawDot(original.midPoint1, { color: `green`, size: 12 })
    //   drawDot(original.midPoint2, { color: `orange`, size: 12 })

    //   drawDot(curve.controlPoint1, { color: `purple`, size: 12 })
    //   drawDot(curve.controlPoint2, { color: `yellow`, size: 12 })
    // }

    drawCurve(curve, { color: lineColor })
  }

  const drawCoonsPatch = (coonsPatch, { shouldDrawIntersections }) => {
    // Draw bounds
    drawBounds(coonsPatch.config.boundingCurves)

    const curves = coonsPatch.api.getCurves()

    // Draw curves along x axis
    curves.xAxis.map((curveSectionsOrCurve) => {
      if (isArray(curveSectionsOrCurve)) {
        curveSectionsOrCurve.map(drawGridCurve)
      } else {
        drawGridCurve(curveSectionsOrCurve)
      }
    })

    // Draw curves along y axis
    curves.yAxis.map((curveSectionsOrCurve) => {
      if (isArray(curveSectionsOrCurve)) {
        curveSectionsOrCurve.map(drawGridCurve)
      } else {
        drawGridCurve(curveSectionsOrCurve)
      }
    })

    if (shouldDrawIntersections) {
      // Draw intersections between grid lines
      coonsPatch.api.getIntersections().map((point) => {
        drawDot(point, {
          size: 3,
        })
      })
    }
  }

  const drawGridSquareBounds = (boundingCurves) => {
    drawPatchBounds(boundingCurves, { lineColor: 'green', lineWidth: 3 })
  }

  function drawLineFromPoints(points) {
    context.beginPath()
    context.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i += 3) {
      context.bezierCurveTo(
        // controlPoint 1
        points[i].x,
        points[i].y,
        // controlPoint 2
        points[i + 1].x,
        points[i + 1].y,
        // endPoint
        points[i + 2].x,
        points[i + 2].y
      )
    }

    context.stroke()
  }

  return {
    drawDot,
    drawCurve,
    drawQuad,
    drawBounds,
    clearCanvas,
    drawCoonsPatch,
    drawGridSquareBounds,
    drawLineFromPoints,
  }
}

export default getCanvasApi
