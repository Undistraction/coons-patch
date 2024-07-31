import {
  interpolateStraightLineOnXAxis,
  interpolateStraightLineOnYAxis,
} from './interpolate/curves/straight'
import { interpolatePointOnCurveEvenlySpaced } from './interpolate/pointOnCurve/even'
import { interpolatePointOnSurface } from './interpolate/pointOnSurface/bilinear'
import { getStepData, getTSize } from './utils/steps'
import {
  validateGetSurfaceCurvesArguments,
  validateGetSurfaceCurvesXAxisArguments,
  validateGetSurfaceCurvesYAxisArguments,
  validateGetSurfaceIntersectionPointsArguments,
  validateGetSurfacePointArguments,
} from './utils/validation'

// -----------------------------------------------------------------------------
// Interpolation functions
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Main API
// -----------------------------------------------------------------------------

/**
 * Computes a point on a surface defined by bounding curves at parameters u and
 * v.
 *
 * @param {Object} boundingCurves - An object containing curves that define the
 * surface boundaries.
 * @param {number} u - The parameter along the first dimension (typically
 * between 0 and 1).
 * @param {number} v - The parameter along the second dimension (typically
 * between 0 and 1).
 * @param {Function}
 * [interpolatePointOnCurve=interpolatePointOnCurveEvenlySpaced] - A function to
 * interpolate points on the curves.
 * @returns {Object} The interpolated point on the surface.
 * @throws {Error} If the arguments are invalid.
 */
export const getSurfacePoint = (
  boundingCurves,
  u,
  v,
  { interpolatePointOnCurve = interpolatePointOnCurveEvenlySpaced } = {}
) => {
  validateGetSurfacePointArguments(
    boundingCurves,
    u,
    v,
    interpolatePointOnCurve
  )
  return interpolatePointOnSurface(
    boundingCurves,
    u,
    v,
    interpolatePointOnCurve
  )
}

/**
 * Generates intersection points on the surface based on the provided bounding
 * curves, columns, and rows.
 *
 * @param {Object} boundingCurves - An object containing curves that define the
 * surface boundaries.
 * @param {number | Array<number> | Array<Object>} columns - Either a number, an
 * array of numbers, or an array of column definitions, each containing a value
 * and an optional isGutter flag.
 * @param {number | Array<number> | Array<Object>} rows - Either a number, an
 * array of numbers, or an array of row definitions.
 * @param {Function}
 * [interpolatePointOnCurve=interpolatePointOnCurveEvenlySpaced] - A function to
 * interpolate points on the curves.
 * @returns {Array<Object>} An array of points representing the intersections on
 * the surface.
 * @throws {Error} If the arguments are invalid.
 */
export const getSurfaceIntersectionPoints = (
  boundingCurves,
  columns,
  rows,
  { interpolatePointOnCurve = interpolatePointOnCurveEvenlySpaced } = {}
) => {
  validateGetSurfaceIntersectionPointsArguments(
    boundingCurves,
    columns,
    rows,
    interpolatePointOnCurve
  )
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

/**
 * Generates surface curves along the X-axis based on the provided bounding
 * curves, columns, and rows.
 *
 * @param {Object} boundingCurves - An object containing curves that define the
 * surface boundaries.
 * @param {number | Array<number> | Array<Object>} columns - Either a number, an
 * array of numbers, or an array of column definitions, each containing a value
 * and an optional isGutter flag.
 * @param {number | Array<number> | Array<Object>} rows - Either a number, an
 * array of numbers, or an array of row definitions, each containing a value
 * and an optional isGutter flag.
 * @param {Function}
 * [interpolatePointOnCurve=interpolatePointOnCurveEvenlySpaced] - A function to
 * interpolate points on the curves.
 * @param {Function} [interpolateLineOnXAxis=interpolateStraightLineOnXAxis] - A
 * function to interpolate lines along the X-axis.
 * @returns {Array<Array<Object>>} A 2D array of curves representing the surface
 * along the X-axis.
 * @throws {Error} If the arguments are invalid.
 */
export const getSurfaceCurvesXAxis = (
  boundingCurves,
  columns,
  rows,
  {
    interpolatePointOnCurve = interpolatePointOnCurveEvenlySpaced,
    interpolateLineOnXAxis = interpolateStraightLineOnXAxis,
  } = {}
) => {
  validateGetSurfaceCurvesXAxisArguments(
    boundingCurves,
    columns,
    rows,
    interpolatePointOnCurve,
    interpolateLineOnXAxis
  )

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

/**
 * Generates surface curves along the Y-axis based on the provided bounding
 * curves, columns, and rows.
 *
 * @param {Object} boundingCurves - An object containing curves that define the
 * surface boundaries.
 * @param {number | Array<number> | Array<Object>} columns - Either a number, an
 * array of numbers, or an array of column definitions, each containing a value
 * and an optional isGutter flag.
 * @param {number | Array<number> | Array<Object>} rows - Either a number, an
 * array of numbers, or an array of row definitions, each containing a value
 * and an optional isGutter flag.
 * @param {Function}
 * [interpolatePointOnCurve=interpolatePointOnCurveEvenlySpaced] - A function to
 * interpolate points on the curves.
 * @param {Function} [interpolateLineOnYAxis=interpolateStraightLineOnYAxis] - A
 * function to interpolate lines along the Y-axis.
 * @returns {Array<Array<Object>>} A 2D array of curves representing the surface
 * along the Y-axis.
 * @throws {Error} If the arguments are invalid.
 */
export const getSurfaceCurvesYAxis = (
  boundingCurves,
  columns,
  rows,
  {
    interpolatePointOnCurve = interpolatePointOnCurveEvenlySpaced,
    interpolateLineOnYAxis = interpolateStraightLineOnYAxis,
  } = {}
) => {
  validateGetSurfaceCurvesYAxisArguments(
    boundingCurves,
    columns,
    rows,
    interpolatePointOnCurve,
    interpolateLineOnYAxis
  )

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

/**
 * Generates surface curves along both the X-axis and Y-axis based on the
 * provided bounding curves, columns, and rows.
 *
 * @param {Object} boundingCurves - An object containing curves that define the
 * surface boundaries.
 * @param {number | Array<number> | Array<Object>} columns - Either a number, an
 * array of numbers, or an array of column definitions, each containing a value
 * and an optional isGutter flag.
 * @param {number | Array<number> | Array<Object>} rows - Either a number, an
 * array of numbers, or an array of row definitions.
 * @param {Function}
 * [interpolatePointOnCurve=interpolatePointOnCurveEvenlySpaced] - A function to
 * interpolate points on the curves.
 * @param {Function} [interpolateLineOnXAxis=interpolateStraightLineOnXAxis] - A
 * function to interpolate lines along the X-axis.
 * @param {Function} [interpolateLineOnYAxis=interpolateStraightLineOnYAxis] - A
 * function to interpolate lines along the Y-axis.
 * @returns {Object} An object containing 2D arrays of curves representing the
 * surface along both the X-axis and Y-axis.
 * @throws {Error} If the arguments are invalid.
 */
export const getSurfaceCurves = (
  boundingCurves,
  columns,
  rows,
  {
    interpolatePointOnCurve = interpolatePointOnCurveEvenlySpaced,
    interpolateLineOnXAxis = interpolateStraightLineOnXAxis,
    interpolateLineOnYAxis = interpolateStraightLineOnYAxis,
  } = {}
) => {
  validateGetSurfaceCurvesArguments(
    boundingCurves,
    columns,
    rows,
    interpolatePointOnCurve,
    interpolateLineOnXAxis,
    interpolateLineOnYAxis
  )
  return {
    xAxis: getSurfaceCurvesXAxis(boundingCurves, columns, rows, {
      interpolatePointOnCurve,
      interpolateLineOnXAxis,
    }),
    yAxis: getSurfaceCurvesYAxis(boundingCurves, columns, rows, {
      interpolatePointOnCurve,
      interpolateLineOnYAxis,
    }),
  }
}
