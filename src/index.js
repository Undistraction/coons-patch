import {
  interpolateStraightLineOnXAxis,
  interpolateStraightLineOnYAxis,
} from './interpolate/curves/straight'
import { interpolatePointOnCurveEvenlySpaced } from './interpolate/pointOnCurve/even'
import { interpolatePointOnSurface } from './interpolate/pointOnSurface/bilinear'
import { validateGetPointArguments } from './utils/validation'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const addAll = (list) => list.reduce((total, { value }) => total + value, 0)

const getCounts = (columns, rows) => ({
  columnsTotalCount: columns.length,
  rowsTotalCount: rows.length,
})

const getTotalValues = (columns, rows) => ({
  columnsTotalValue: addAll(columns),
  rowsTotalValue: addAll(rows),
})

const getTSize = (steps, idx, totalValue) => {
  const step = steps[idx]
  const stepValue = step.value || step
  return stepValue / totalValue
}

const getStepData = (columns, rows) => ({
  ...getCounts(columns, rows),
  ...getTotalValues(columns, rows),
})

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

// Re-export interpolation functions

export {
  interpolateCurveOnXAxis,
  interpolateCurveOnYAxis,
} from './interpolate/curves/curved'
export {
  interpolateStraightLineOnXAxis,
  interpolateStraightLineOnYAxis,
} from './interpolate/curves/straight'
export { interpolatePointOnCurveEvenlySpaced } from './interpolate/pointOnCurve/even'
export { interpolatePointOnCurveLinear } from './interpolate/pointOnCurve/linear'

// Main API

export const getSurfacePoint = (
  boundingCurves,
  u,
  v,
  interpolatePointOnCurve = interpolatePointOnCurveEvenlySpaced
) => {
  validateGetPointArguments(u, v)
  return interpolatePointOnSurface(
    boundingCurves,
    u,
    v,
    interpolatePointOnCurve
  )
}

export const getSurfaceCurvesXAxis = (
  boundingCurves,
  columns,
  rows,
  interpolateLineOnXAxis = interpolateStraightLineOnXAxis,
  interpolatePointOnCurve = interpolatePointOnCurveEvenlySpaced
) => {
  const {
    columnsTotalCount,
    rowsTotalCount,
    columnsTotalValue,
    rowsTotalValue,
  } = getStepData(columns, rows)

  const curves = []
  let vStart = 0

  // Short circuit if we are only 1x1 and just return bounds
  if (columnsTotalCount === 1 && rowsTotalCount === 1) {
    return [[boundingCurves.top], [boundingCurves.bottom]]
  }

  for (let rowIdx = 0; rowIdx <= rowsTotalCount; rowIdx++) {
    const lineSections = []
    let uStart = 0

    for (let columnIdx = 0; columnIdx < columnsTotalCount; columnIdx++) {
      const column = columns[columnIdx]
      const columnValue = column?.value
      const uSize = columnValue / columnsTotalValue
      const uEnd = uStart + uSize

      if (!column.isGutter) {
        const curve = interpolateLineOnXAxis(
          boundingCurves,
          uStart,
          uSize,
          uEnd,
          vStart,
          interpolatePointOnCurve
        )

        lineSections.push(curve)
      }

      uStart += uSize
    }

    curves.push(lineSections)

    if (rowIdx !== rowsTotalCount) {
      vStart += getTSize(rows, rowIdx, rowsTotalValue)
    }
  }

  return curves
}

export const getSurfaceCurvesYAxis = (
  boundingCurves,
  columns,
  rows,
  interpolateLineOnYAxis = interpolateStraightLineOnYAxis,
  interpolatePointOnCurve = interpolatePointOnCurveEvenlySpaced
) => {
  const {
    columnsTotalCount,
    rowsTotalCount,
    columnsTotalValue,
    rowsTotalValue,
  } = getStepData(columns, rows)

  const curves = []
  let uStart = 0

  // Short circuit if we are only 1x1 and just return the bounds
  if (columnsTotalCount === 1 && rowsTotalCount === 1) {
    return [[boundingCurves.left], [boundingCurves.right]]
  }

  for (let columnIdx = 0; columnIdx <= columnsTotalCount; columnIdx++) {
    const lineSections = []
    let vStart = 0

    for (let rowIdx = 0; rowIdx < rowsTotalCount; rowIdx++) {
      const row = rows[rowIdx]
      const rowValue = row?.value
      const vSize = rowValue / rowsTotalValue
      const vEnd = vStart + vSize

      if (!row.isGutter) {
        const curve = interpolateLineOnYAxis(
          boundingCurves,
          vStart,
          vSize,
          vEnd,
          uStart,
          interpolatePointOnCurve
        )

        lineSections.push(curve)
      }

      vStart += vSize
    }

    curves.push(lineSections)

    // Calculate the position of the next column
    if (columnIdx !== columnsTotalCount) {
      uStart += getTSize(columns, columnIdx, columnsTotalValue)
    }
  }

  return curves
}

export const getSurfaceCurves = (
  boundingCurves,
  columns,
  rows,
  interpolatePointOnCurve = interpolatePointOnCurveEvenlySpaced,
  interpolateLineOnXAxis = interpolateStraightLineOnXAxis,
  interpolateLineOnYAxis = interpolateStraightLineOnYAxis
) => {
  return {
    xAxis: getSurfaceCurvesXAxis(
      boundingCurves,
      columns,
      rows,
      interpolateLineOnXAxis,
      interpolatePointOnCurve
    ),
    yAxis: getSurfaceCurvesYAxis(
      boundingCurves,
      columns,
      rows,
      interpolateLineOnYAxis,
      interpolatePointOnCurve
    ),
  }
}

export const getSurfaceIntersectionPoints = (
  boundingCurves,
  columns,
  rows,
  interpolatePointOnCurve = interpolatePointOnCurveEvenlySpaced
) => {
  const {
    columnsTotalCount,
    rowsTotalCount,
    columnsTotalValue,
    rowsTotalValue,
  } = getStepData(columns, rows)

  const intersections = []
  let vStart = 0

  for (let rowIdx = 0; rowIdx <= rowsTotalCount; rowIdx++) {
    let uStart = 0

    for (let columnIdx = 0; columnIdx <= columnsTotalCount; columnIdx++) {
      const point = interpolatePointOnSurface(
        boundingCurves,
        uStart,
        vStart,
        interpolatePointOnCurve
      )

      intersections.push(point)

      if (columnIdx !== columnsTotalCount) {
        uStart += getTSize(columns, columnIdx, columnsTotalValue)
      }
    }

    if (rowIdx !== rowsTotalCount) {
      vStart += getTSize(rows, rowIdx, rowsTotalValue)
    }
  }

  return intersections
}
