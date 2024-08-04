import {
  interpolateStraightLineU,
  interpolateStraightLineV,
} from './interpolate/curves/straight'
import { interpolatePointOnCurveEvenlySpaced } from './interpolate/pointOnCurve/even'
import { interpolatePointOnSurface } from './interpolate/pointOnSurface/bilinear'
import {
  BoundingCurves,
  GetSurfaceCurvesConfig,
  GetSurfaceCurvesUConfig,
  GetSurfaceCurvesVConfig,
  GetSurfaceIntersectionPointsConfig,
  GetSurfacePointConfig,
  Points,
  StepCurves,
  UnprocessedSteps,
  UVCurves,
} from './types'
import { getStepData, getTSize } from './utils/steps'
import {
  validateGetSurfaceCurvesArguments,
  validategetSurfaceCurvesUArguments,
  validategetSurfaceCurvesVArguments,
  validateGetSurfaceIntersectionPointsArguments,
  validateGetSurfacePointArguments,
} from './utils/validation'

/**
 * @groupDescription API
 * Access information about a coons patch defined by four bounding curves.
 *
 *
 * @groupDescription Interpolation
 * Functions used to interpolate points on curves and surfaces.
 */

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

const PRECISION_DEFAULT = 20

const interpolatePointOnCurveDefault = interpolatePointOnCurveEvenlySpaced({
  precision: PRECISION_DEFAULT,
})

// -----------------------------------------------------------------------------
// Export Main API
// -----------------------------------------------------------------------------

/**
 * Computes a point on a surface defined by bounding curves at parameters u and
 * v.
 *
 * @param {BoundingCurves} boundingCurves - An object containing curves that
 * define the surface boundaries.
 * @param {number} u - The parameter along the first dimension (0–1).
 * @param {number} v - The parameter along the second dimension (0–1).
 * @param {Object} [config] - Configuration object.
 * @param {Function}
 * [config.interpolatePointOnCurve=interpolatePointOnCurveDefault] - A function
 * to interpolate points on the curves.
 * @returns {Point} The interpolated point on the surface.
 * @throws {Error} If the arguments are invalid.
 *
 * @group API
 */
export const getSurfacePoint = (
  boundingCurves: BoundingCurves,
  u: number,
  v: number,
  {
    interpolatePointOnCurve = interpolatePointOnCurveDefault,
  }: GetSurfacePointConfig = {}
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
 * @param {BoundingCurves} boundingCurves - An object containing curves that
 * define the surface boundaries.
 * @param {number | Array<number> | Array<Object>} columns - Either a number, an
 * array of numbers, or an array of column definitions, each containing a value
 * and an optional isGutter flag.
 * @param {number | Array<number> | Array<Object>} rows - Either a number, an
 * array of numbers, or an array of row definitions, each containing a value and
 * an optional isGutter flag.
 * @param {Object} [config] - Configuration object.
 * @param {Function}
 * [config.interpolatePointOnCurve=interpolatePointOnCurveDefault] - A function
 * to interpolate points on the curves.
 * @returns {Points} An array of points representing the intersections on the
 * surface.
 * @throws {Error} If the arguments are invalid.
 *
 * @group API
 */
export const getSurfaceIntersectionPoints = (
  boundingCurves: BoundingCurves,
  columns: UnprocessedSteps,
  rows: UnprocessedSteps,
  {
    interpolatePointOnCurve = interpolatePointOnCurveDefault,
  }: GetSurfaceIntersectionPointsConfig = {}
): Points => {
  validateGetSurfaceIntersectionPointsArguments(
    boundingCurves,
    columns,
    rows,
    interpolatePointOnCurve
  )

  const {
    processedColumns,
    processedRows,
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
        uStart += getTSize(processedColumns, columnIdx, columnsTotalValue)
      }
    }

    if (rowIdx !== rowsTotalCount) {
      vStart += getTSize(processedRows, rowIdx, rowsTotalValue)
    }
  }

  return intersections
}

/**
 * Generates surface curves along the U-axis based on the provided bounding
 * curves, columns, and rows.
 *
 * @param {BoundingCurves} boundingCurves - An object containing curves that
 * define the surface boundaries.
 * @param {number | Array<number> | Array<Object>} columns - Either a number, an
 * array of numbers, or an array of column definitions, each containing a value
 * and an optional isGutter flag.
 * @param {number | Array<number> | Array<Object>} rows - Either a number, an
 * array of numbers, or an array of row definitions, each containing a value and
 * an optional isGutter flag.
 * @param {Object} [config] - Configuration object.
 * @param {Function}
 * [config.interpolatePointOnCurve=interpolatePointOnCurveDefault] - A function
 * to interpolate points on the curves.
 * @param {Function} [config.interpolateLineU=interpolateStraightLineU] - A
 * function to interpolate lines along the U-axis.
 * @returns {StepCurves[]} A 2D array of curves representing the surface along
 * the U-axis.
 * @throws {Error} If the arguments are invalid.
 *
 * @group API
 */
export const getSurfaceCurvesU = (
  boundingCurves: BoundingCurves,
  columns: UnprocessedSteps,
  rows: UnprocessedSteps,
  {
    interpolatePointOnCurve = interpolatePointOnCurveDefault,
    interpolateLineU = interpolateStraightLineU,
  }: GetSurfaceCurvesUConfig = {}
): StepCurves[] => {
  validategetSurfaceCurvesUArguments(
    boundingCurves,
    columns,
    rows,
    interpolatePointOnCurve,
    interpolateLineU
  )

  const {
    processedColumns,
    processedRows,
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
      const column = processedColumns[columnIdx]
      const columnValue = column?.value
      const uSize = columnValue / columnsTotalValue
      const uEnd = uStart + uSize

      if (!column.isGutter) {
        const curve = interpolateLineU(
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
      vStart += getTSize(processedRows, rowIdx, rowsTotalValue)
    }
  }

  return curves
}

/**
 * Generates surface curves along the V-axis based on the provided bounding
 * curves, columns, and rows.
 *
 * @param {BoundingCurves} boundingCurves - An object containing curves that
 * define the surface boundaries.
 * @param {number | Array<number> | Array<Object>} columns - Either a number, an
 * array of numbers, or an array of column definitions, each containing a value
 * and an optional isGutter flag.
 * @param {number | Array<number> | Array<Object>} rows - Either a number, an
 * array of numbers, or an array of row definitions, each containing a value and
 * an optional isGutter flag.
 * @param {Object} [config] - Configuration object.
 * @param {Function}
 * [config.interpolatePointOnCurve=interpolatePointOnCurveDefault] - A function
 * to interpolate points on the curves.
 * @param {Function} [config.interpolateLineV=interpolateStraightLineV] - A
 * function to interpolate lines along the V-axis.
 * @returns {Array<Array<Object>>} A 2D array of curves representing the surface
 * along the V-axis.
 * @throws {Error} If the arguments are invalid.
 *
 * @group API
 */
export const getSurfaceCurvesV = (
  boundingCurves: BoundingCurves,
  columns: UnprocessedSteps,
  rows: UnprocessedSteps,
  {
    interpolatePointOnCurve = interpolatePointOnCurveDefault,
    interpolateLineV = interpolateStraightLineV,
  }: GetSurfaceCurvesVConfig = {}
): StepCurves[] => {
  validategetSurfaceCurvesVArguments(
    boundingCurves,
    columns,
    rows,
    interpolatePointOnCurve,
    interpolateLineV
  )

  const {
    processedColumns,
    processedRows,
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
      const row = processedRows[rowIdx]
      const rowValue = row?.value
      const vSize = rowValue / rowsTotalValue
      const vEnd = vStart + vSize

      if (!row.isGutter) {
        const curve = interpolateLineV(
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
      uStart += getTSize(processedColumns, columnIdx, columnsTotalValue)
    }
  }

  return curves
}

/**
 * Generates surface curves along both the U-axis and V-axis based on the
 * provided bounding curves, columns, and rows.
 *
 * @param {BoundingCurves} boundingCurves - An object containing curves that define the
 * surface boundaries.
 * @param {number | Array<number> | Array<Object>} columns - Either a number, an
 * array of numbers, or an array of column definitions, each containing a value
 * and an optional isGutter flag.
 * @param {number | Array<number> | Array<Object>} rows - Either a number, an
 * array of numbers, or an array of row definitions, each containing a value
 * and an optional isGutter flag.
 * @param {Object} [config] - Configuration object.
 * @param {Function} [config.interpolatePointOnCurve=interpolatePointOnCurveDefault] - A function to
 * interpolate points on the curves.
 * @param {Function} [config.interpolateLineU=interpolateStraightLineU] - A
 * function to interpolate lines along the U-axis.
 * @param {Function} [config.interpolateLineV=interpolateStraightLineV] - A
 * function to interpolate lines along the V-axis.
 * @returns {UVCurves} An object containing 2D arrays of curves representing the
 * surface along both the U-axis and V-axis.
 * @throws {Error} If the arguments are invalid.
 *
 * @group API
 */
export const getSurfaceCurves = (
  boundingCurves: BoundingCurves,
  columns: UnprocessedSteps,
  rows: UnprocessedSteps,
  {
    interpolatePointOnCurve = interpolatePointOnCurveDefault,
    interpolateLineU = interpolateStraightLineU,
    interpolateLineV = interpolateStraightLineV,
  }: GetSurfaceCurvesConfig = {}
): UVCurves => {
  validateGetSurfaceCurvesArguments(
    boundingCurves,
    columns,
    rows,
    interpolatePointOnCurve,
    interpolateLineU,
    interpolateLineV
  )
  return {
    u: getSurfaceCurvesU(boundingCurves, columns, rows, {
      interpolatePointOnCurve,
      interpolateLineU,
    }),
    v: getSurfaceCurvesV(boundingCurves, columns, rows, {
      interpolatePointOnCurve,
      interpolateLineV,
    }),
  }
}