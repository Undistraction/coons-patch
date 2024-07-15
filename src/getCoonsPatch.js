import BezierEasing from 'bezier-easing'
import {
  getCurveFromArray,
  getIntersectionBetweenCurves,
  getSubcurveBetweenRatios,
  interpolatCurve,
  isArray,
  isInt,
  isNil,
} from './utils'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

// See https://gre.github.io/bezier-easing-editor/example/
const easeX = BezierEasing(0, 0, 1, 1)
const easeY = BezierEasing(0, 0, 1, 1)

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

export const isUndefined = (value) => typeof value === 'undefined'

const buildSpacing = (v) => {
  const spacing = []
  for (let idx = 0; idx < v; idx++) {
    spacing.push(1)
  }
  return spacing
}

const validateGrid = (grid) => {
  if (!grid) {
    throw new Error('You must supply a grid')
  }

  if (isNil(grid.columns)) {
    throw new Error('You must supply grid.columns(Array or Int)')
  }

  if (!isArray(grid.columns) && !isInt(grid.columns)) {
    throw new Error('grid.columns must be an Array of Ints or Int')
  }

  if (isNil(grid.rows)) {
    throw new Error('You must supply grid.rows(Array or Int)')
  }

  if (!isArray(grid.rows) && !isInt(grid.rows)) {
    throw new Error('grid.rows must be an Array of Ints or Int')
  }
}

const validateGetSquareArguments = (x, y, columns, rows) => {
  if (x >= columns || y >= rows) {
    throw new Error(
      `Grid is '${columns}' x '${rows}' but you passed x:'${x}' and y:'${y}'`
    )
  }
}

const getCurves = (steps, curvesPair1, curvesPair2, ease) => {
  let currentWidth = 0
  const stepsTotal = steps.length
  const curves = []
  const stepsWidthTotal = steps.reduce(addToTotal, 0)
  for (let step = 0; step <= stepsTotal; step++) {
    // Allow different grid spacings
    const ratio = currentWidth / stepsWidthTotal
    currentWidth = currentWidth + steps[step]

    // Allow easing
    const ratioXEased = ease(ratio)
    const curve = interpolatCurve(ratioXEased, curvesPair1, curvesPair2)

    curves.push({ ...curve, step: step })
  }
  return curves
}

const addToTotal = (total, value) => total + value

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

const getCoonsPatch = (boundingCurves, grid) => {
  validateGrid(grid)
  // Columns can be either an int, or an array containing ints, each
  // representing the width of that column. If the total widths are different to
  // the width of the shape described by the bounding curves, they will be
  // mapped to the the width of the shape, acting as ratios instead of absolute
  // widths. If the supplied value is an int, we create an array with a length
  // of the int, with a uniform value for each item.
  const columns = isArray(grid.columns)
    ? grid.columns
    : buildSpacing(grid.columns)

  // Rows can be either an int, or an array containing ints, each representing
  // the height of that column. If the total heights are different to the height
  // of the shape described by the bounding curves, they will be mapped to the
  // the height of the shape, acting as ratios instead of absolute heights. If
  // the supplied value is an int, we create an array with a length of the int,
  // with a uniform value for each item.
  const rows = isArray(grid.rows) ? grid.rows : buildSpacing(grid.rows)

  const curvesFromTopToBottom = getCurves(
    columns,
    { curve1: boundingCurves.top, curve2: boundingCurves.bottom },
    { curve3: boundingCurves.left, curve4: boundingCurves.right },
    easeX
  )

  const curvesFromLeftToRight = getCurves(
    rows,
    { curve1: boundingCurves.left, curve2: boundingCurves.right },
    { curve3: boundingCurves.top, curve4: boundingCurves.bottom },
    easeY
  )

  // const intersections = getIntersectionsBetweenCurveSets({
  //   curvesFromLeftToRight,
  //   curvesFromTopToBottom,
  // })

  // // Due to the nature of finding intersections between curves, Bezier.js's
  // // calculations often result in multiple points for the same intersection that
  // // are very close together, so we need to filter out these points.
  // const filteredIntersections = filterIntersections(intersections)

  // // For reasons I don't understand the Bezier.js library doesn't detect
  // // intersections when the intersection is at the ends of both curves. This
  // // means all four corner points will be missing, so we need to add them back
  // // in, and do it at the right indices.
  // const filteredIntersectionsWithCornerPoints = addCornerPointsToIntersections(
  //   filteredIntersections,
  //   boundingCurves,
  //   columns.length,
  //   rows.length
  // )

  // Get four curves that describe the bounds of the grid-sqare with the
  // supplied grid coordicates
  const getGridSquareBounds = (x, y) => {
    validateGetSquareArguments(x, y, columns, rows)

    // Find the curves that run along the grid square bounds
    const topCurve = curvesFromLeftToRight[y]
    const bottomCurve = curvesFromLeftToRight[y + 1]
    const leftCurve = curvesFromTopToBottom[x]
    const rightCurve = curvesFromTopToBottom[x + 1]

    const topCurveLeftIntersections = getIntersectionBetweenCurves(
      topCurve,
      leftCurve,
      'topCurveLeftIntersections'
    )

    const topCurveRightIntersections = getIntersectionBetweenCurves(
      topCurve,
      rightCurve,
      `topCurveLeftIntersections`
    )

    const bottomCurveLeftIntersections = getIntersectionBetweenCurves(
      bottomCurve,
      leftCurve,
      `bottomCurveLeftIntersections`
    )

    const bottomCurveRightIntersections = getIntersectionBetweenCurves(
      bottomCurve,
      rightCurve,
      `bottomCurveRightIntersections`
    )

    const rightCurveTopIntersections = getIntersectionBetweenCurves(
      rightCurve,
      topCurve,
      `rightCurveTopIntersections`
    )

    const rightCurveBottomIntersections = getIntersectionBetweenCurves(
      rightCurve,
      bottomCurve,
      `rightCurveBottomIntersections`
    )

    const leftCurveTopIntersections = getIntersectionBetweenCurves(
      leftCurve,
      topCurve,
      `leftCurveTopIntersections`
    )

    const leftCurveBottomIntersections = getIntersectionBetweenCurves(
      leftCurve,
      bottomCurve,
      `leftCurveBottomIntersections`
    )

    if (
      topCurveLeftIntersections.length === 0 ||
      topCurveRightIntersections.length === 0 ||
      bottomCurveLeftIntersections.length === 0 ||
      bottomCurveRightIntersections.length === 0 ||
      topCurveLeftIntersections.length === 0 ||
      leftCurveTopIntersections.length === 0 ||
      leftCurveBottomIntersections.length === 0 ||
      rightCurveTopIntersections.length === 0 ||
      rightCurveBottomIntersections.length === 0
    ) {
      throw new Error('Missing intesection')
    }

    // Get sub-curves that describe the grid-square's bounds
    const top = getSubcurveBetweenRatios(
      topCurve,
      topCurveLeftIntersections[0].ratio,
      topCurveRightIntersections[0].ratio
    )
    const bottom = getSubcurveBetweenRatios(
      bottomCurve,
      bottomCurveLeftIntersections[0].ratio,
      bottomCurveRightIntersections[0].ratio
    )
    const left = getSubcurveBetweenRatios(
      leftCurve,
      leftCurveTopIntersections[0].ratio,
      leftCurveBottomIntersections[0].ratio
    )
    const right = getSubcurveBetweenRatios(
      rightCurve,
      rightCurveTopIntersections[0].ratio,
      rightCurveBottomIntersections[0].ratio
    )

    return {
      top: getCurveFromArray(top.points),
      bottom: getCurveFromArray(bottom.points),
      left: getCurveFromArray(left.points),
      right: getCurveFromArray(right.points),
      intersections: {
        topCurveLeftIntersections,
        topCurveRightIntersections,
      },
    }
  }

  return {
    // intersections: filteredIntersectionsWithCornerPoints,
    curvesFromLeftToRight,
    curvesFromTopToBottom,
    boundingCurves,
    getGridSquareBounds,
    columns,
    rows,
  }
}

export default getCoonsPatch
