import { COORDINATE } from '../const'
import { fitCubicBezierToPoints } from './bezier'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

const RATIO_MIDPOINT_1 = 0.25
const RATIO_MIDPOINT_2 = 0.75

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const getCoordinateOnSurface = (
  axis,
  { pointOnTopCurve, pointOnBottomCurve, pointOnLeftCurve, pointOnRightCurve },
  { cornerTopLeft, cornerTopRight, cornerBottomLeft, cornerBottomRight },
  u,
  v
) => {
  return (
    (1 - v) * pointOnTopCurve[axis] +
    v * pointOnBottomCurve[axis] +
    (1 - u) * pointOnLeftCurve[axis] +
    u * pointOnRightCurve[axis] -
    (1 - u) * (1 - v) * cornerTopLeft[axis] -
    u * (1 - v) * cornerTopRight[axis] -
    (1 - u) * v * cornerBottomLeft[axis] -
    u * v * cornerBottomRight[axis]
  )
}

const addAll = (list) => list.reduce((total, value) => total + value, 0)

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const getPointOnSurface = (
  { top, bottom, left, right },
  u,
  v,
  interpolatePointOnCurve
) => {
  const points = {
    pointOnTopCurve: interpolatePointOnCurve(u, top),
    pointOnBottomCurve: interpolatePointOnCurve(u, bottom),
    pointOnLeftCurve: interpolatePointOnCurve(v, left),
    pointOnRightCurve: interpolatePointOnCurve(v, right),
  }

  const corners = {
    cornerBottomLeft: bottom.startPoint,
    cornerBottomRight: bottom.endPoint,
    cornerTopLeft: top.startPoint,
    cornerTopRight: top.endPoint,
  }

  return {
    x: getCoordinateOnSurface(COORDINATE.X, points, corners, u, v),
    y: getCoordinateOnSurface(COORDINATE.Y, points, corners, u, v),
  }
}

export const getCurvesOnXAxis = (
  boundingCurves,
  columns,
  rows,
  interpolatePointOnCurve
) => {
  const columnsTotalCount = columns.length
  const rowsTotalCount = rows.length

  const columnsTotalValue = addAll(columns)
  const rowsTotalValue = addAll(rows)

  const curves = []
  let columnRatioTotal = 0

  // Short circuit if we are only 1x1 and just return the bounds
  if (columns.length === 1 && rows.length === 1) {
    return [[boundingCurves.left], [boundingCurves.right]]
  }

  for (let columnIdx = 0; columnIdx <= columnsTotalCount; columnIdx++) {
    const curveSections = []
    const columnValue = columns[columnIdx]
    const columnRatio = columnValue / columnsTotalValue

    let rowRatioTotal = 0

    for (let rowIdx = 0; rowIdx < rowsTotalCount; rowIdx++) {
      const rowValue = rows[rowIdx]
      const rowRatio = rowValue / rowsTotalValue
      const rowEndRatio = rowRatioTotal + rowRatio

      const startPoint = getPointOnSurface(
        boundingCurves,
        columnRatioTotal,
        rowRatioTotal,
        interpolatePointOnCurve,
        true
      )

      const endPoint = getPointOnSurface(
        boundingCurves,
        columnRatioTotal,
        rowEndRatio,
        interpolatePointOnCurve
      )
      const midPoint1 = getPointOnSurface(
        boundingCurves,
        columnRatioTotal,
        rowRatioTotal + rowRatio * RATIO_MIDPOINT_1,
        interpolatePointOnCurve
      )

      const midPoint2 = getPointOnSurface(
        boundingCurves,
        columnRatioTotal,
        rowRatioTotal + rowRatio * RATIO_MIDPOINT_2,
        interpolatePointOnCurve
      )

      const curve = fitCubicBezierToPoints(
        [startPoint, midPoint1, midPoint2, endPoint],
        [0, RATIO_MIDPOINT_1, RATIO_MIDPOINT_2, 1]
      )

      rowRatioTotal = rowRatioTotal + rowRatio

      curveSections.push({
        ...curve,
      })
    }
    columnRatioTotal = columnRatioTotal + columnRatio
    curves.push(curveSections)
  }

  return curves
}

export const getCurvesOnYAxis = (
  boundingCurves,
  columns,
  rows,
  interpolatePointOnCurve
) => {
  const columnsTotalCount = columns.length
  const rowsTotalCount = rows.length

  const columnsTotalValue = addAll(columns)
  const rowsTotalValue = addAll(rows)

  const curves = []
  let rowRatioTotal = 0

  // Short circuit if we are only 1x1
  if (columns.length === 1 && rows.length === 1) {
    return [[boundingCurves.top], [boundingCurves.bottom]]
  }

  for (let rowIdx = 0; rowIdx <= rowsTotalCount; rowIdx++) {
    const curveSections = []
    const rowValue = rows[rowIdx]
    const rowRatio = rowValue / rowsTotalValue

    let columnRatioTotal = 0

    for (let columnIdx = 0; columnIdx < columnsTotalCount; columnIdx++) {
      const columnValue = columns[columnIdx]
      const columnRatio = columnValue / columnsTotalValue
      const columnEndRatio = columnRatioTotal + columnRatio

      const startPoint = getPointOnSurface(
        boundingCurves,
        columnRatioTotal,
        rowRatioTotal,
        interpolatePointOnCurve
      )

      const endPoint = getPointOnSurface(
        boundingCurves,
        columnEndRatio,
        rowRatioTotal,
        interpolatePointOnCurve
      )

      const midPoint1 = getPointOnSurface(
        boundingCurves,
        columnRatioTotal + columnRatio * RATIO_MIDPOINT_1,
        rowRatioTotal,
        interpolatePointOnCurve
      )

      const midPoint2 = getPointOnSurface(
        boundingCurves,
        columnRatioTotal + columnRatio * RATIO_MIDPOINT_2,
        rowRatioTotal,
        interpolatePointOnCurve
      )

      const curve = fitCubicBezierToPoints(
        [startPoint, midPoint1, midPoint2, endPoint],
        [0, RATIO_MIDPOINT_1, RATIO_MIDPOINT_2, 1]
      )

      columnRatioTotal = columnRatioTotal + columnRatio
      curveSections.push({
        ...curve,
      })
    }

    rowRatioTotal = rowRatioTotal + rowRatio
    curves.push(curveSections)
  }

  return curves
}

export const getGridIntersections = (
  boundingCurves,
  columns,
  rows,
  interpolatePointOnCurve
) => {
  const intersections = []
  const columnsTotal = columns.length
  const columnsTotalValue = addAll(columns)
  const rowsTotal = rows.length
  const rowsTotalValue = addAll(rows)

  let rowRatioTotal = 0

  for (let rowIdx = 0; rowIdx <= rowsTotal; rowIdx++) {
    const rowValue = rows[rowIdx]
    const rowRatio = rowValue / rowsTotalValue

    let columnRatioTotal = 0

    for (let columnIdx = 0; columnIdx <= columnsTotal; columnIdx++) {
      const columnValue = columns[columnIdx]
      const columnRatio = columnValue / columnsTotalValue

      const point = getPointOnSurface(
        boundingCurves,
        columnRatioTotal,
        rowRatioTotal,
        interpolatePointOnCurve
      )

      intersections.push(point)
      columnRatioTotal = columnRatioTotal + columnRatio
    }
    rowRatioTotal = rowRatioTotal + rowRatio
  }

  return intersections
}
