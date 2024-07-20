import React from 'react'
import { useDebounce } from 'use-debounce'
import { INTERPOLATION_STRATEGY } from '../../../src/const'
import getCoonsPatch from '../../../src/getCoonsPatch'
import { BOUNDS_POINT_IDS } from '../const'
import useObserveClientSize from '../hooks/useObserveClientSize'
import {
  clampGridSquareToGridDimensions,
  getRandomBoundingCurves,
} from '../utils'
import { updateNodePosition } from '../utils/corners'
import localStorageApi from '../utils/localStorageApi'
import Canvas from './Canvas'
import ControlNodes from './Canvas/ControlNodes'
import Sidebar from './Sidebar'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

const GRID_DEFAULT = {
  columns: 25,
  rows: 25,
  interpolationStrategy: INTERPOLATION_STRATEGY.EVEN,
  highAccuracy: false,
  // columns: [1, 0.2, 1, 0.2, 1, 0.2, 1],
  // rows: [1, 0.2, 1, 0.2, 1, 0.2, 1],
}

const SURFACE_DEFAULT = { x: 0, y: 0, gridSquare: {} }

const CONFIG_DEFAULT = {
  [BOUNDS_POINT_IDS.TOP_LEFT]: { isLinked: false, isMirrored: false },
  [BOUNDS_POINT_IDS.TOP_RIGHT]: { isLinked: false, isMirrored: false },
  [BOUNDS_POINT_IDS.BOTTOM_LEFT]: { isLinked: false, isMirrored: false },
  [BOUNDS_POINT_IDS.BOTTOM_RIGHT]: { isLinked: false, isMirrored: false },
}

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const handleNodePositionChange =
  (boundingCurves, setBoundingCurves, config) => (nodeId) => (newPosition) => {
    const updatedBoundingCurves = updateNodePosition(
      boundingCurves,
      nodeId,
      newPosition,
      config
    )
    setBoundingCurves(updatedBoundingCurves)
  }

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

const App = () => {
  const [canvas, setCanvas] = React.useState(null)
  const [boundingCurves, setBoundingCurves] = React.useState(null)
  const [coonsPatch, setCoonsPatch] = React.useState(null)
  const [config, setConfig] = React.useState(CONFIG_DEFAULT)
  const [grid, setGrid] = React.useState(GRID_DEFAULT)
  const [surface, setSurface] = React.useState(SURFACE_DEFAULT)
  const [canvasSize, setCanvasSize] = React.useState({ width: 0, height: 0 })
  const [savedBounds, setSavedBounds] = React.useState({ ...localStorage })
  const displayRef = React.useRef(null)
  const [boundingCurvesDebounced] = useDebounce(boundingCurves, 5)

  useObserveClientSize(displayRef, setCanvasSize, {
    // left + right border widths
    width: -2,
    // top + bottom border widths
    height: -2,
  })

  React.useLayoutEffect(() => {
    if (boundingCurvesDebounced) {
      const coonsPatch = getCoonsPatch(boundingCurvesDebounced, grid)
      setCoonsPatch(coonsPatch)
    }
  }, [boundingCurvesDebounced, canvas, grid, canvasSize])

  const gridSquareClamped = React.useMemo(
    () =>
      surface.gridSquare
        ? clampGridSquareToGridDimensions(surface.gridSquare, grid)
        : surface.gridSquare,
    [surface, grid]
  )

  return (
    <div className="relative flex h-full w-screen flex-row space-x-5 p-5">
      <div
        className="relative h-full flex-grow overflow-hidden"
        id="patch-view"
        ref={displayRef}
      >
        <Canvas
          setCanvas={setCanvas}
          width={canvasSize.width}
          height={canvasSize.height}
          coonsPatch={coonsPatch}
          gridSquare={gridSquareClamped}
          surface={surface}
          grid={grid}
        />
        {boundingCurves && (
          <ControlNodes
            boundingCurves={boundingCurves}
            onNodePositionChange={handleNodePositionChange(
              boundingCurves,
              setBoundingCurves,
              config
            )}
          />
        )}
      </div>
      <div className="-my-5 w-[300px] flex-shrink-0 flex-grow-0 overflow-y-scroll">
        <Sidebar
          grid={grid}
          canvas={canvas}
          getRandomBoundingCurves={getRandomBoundingCurves}
          setBoundingCurves={setBoundingCurves}
          boundingCurves={boundingCurves}
          config={config}
          setConfig={setConfig}
          setGrid={setGrid}
          onSave={(name) => {
            localStorageApi.save(name, { grid, boundingCurves })
            setSavedBounds({ ...localStorage })
          }}
          onLoad={(name) => {
            const result = localStorageApi.load(name)
            setGrid(result.grid)
            setBoundingCurves(result.boundingCurves)
          }}
          onNodePositionChange={handleNodePositionChange(
            boundingCurves,
            setBoundingCurves,
            config
          )}
          savedBounds={savedBounds}
          surface={surface}
          setSurface={setSurface}
        />
      </div>
    </div>
  )
}

export default App
