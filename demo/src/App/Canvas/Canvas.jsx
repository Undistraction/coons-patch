import React from 'react'
import { isInt } from '../../../../src/utils/types'
import getCanvasApi from '../../utils/getCanvasApi'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

const Canvas = ({
  setCanvas,
  width,
  height,
  coonsPatch,
  gridSquare,
  surface,
  grid,
}) => {
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (ref.current) {
      setCanvas(ref.current)
    }
  }, [ref.current])

  React.useLayoutEffect(() => {
    const canvasContext = ref.current.getContext('2d')
    const canvasApi = getCanvasApi(canvasContext)
    canvasApi.clearCanvas(ref.current)

    if (coonsPatch) {
      canvasApi.drawCoonsPatch(coonsPatch, {
        shouldDrawIntersections: grid.shouldDrawIntersections,
      })

      if (gridSquare && isInt(gridSquare.x) && isInt(gridSquare.y)) {
        const gridSquareBounds = coonsPatch.api.getGridCellBounds(
          gridSquare.x,
          gridSquare.y
        )
        canvasApi.drawGridSquareBounds(gridSquareBounds)
      }
    }
  }, [coonsPatch, gridSquare, surface])

  return (
    <canvas
      id="canvas"
      className="border border-black"
      ref={ref}
      width={width}
      height={height}
    ></canvas>
  )
}

export default Canvas
