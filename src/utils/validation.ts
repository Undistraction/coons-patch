import {
  BoundingCurves,
  Curve,
  InterpolateLineU,
  InterpolateLineV,
  InterpolatePointOnCurve,
  Point,
  UnprocessedSteps,
} from '../types'
import { mapObj } from './functional'
import { roundTo5 } from './math'
import { isArray, isFunction, isInt, isNumber, isPlainObj } from './types'
// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const roundPointCoordinates = (point: Point): Point =>
  mapObj(roundTo5, point) as Point

const getPointsAreSame = (point1: Point, point2: Point): boolean => {
  // Round the points to 5 decimal places to avoid rounding issues where the
  // values are fractionally different
  const roundedPoint1 = roundPointCoordinates(point1)
  const roundedPoint2 = roundPointCoordinates(point2)

  return (
    roundedPoint1.x === roundedPoint2.x && roundedPoint1.y === roundedPoint2.y
  )
}

const isValidPoint = (point: Point): point is Point =>
  isPlainObj(point) && isNumber(point.x) && isNumber(point.y)

const validateCurve = (curve: Curve, name: string) => {
  if (!isPlainObj(curve)) {
    throw new Error(`Curve '${name}' must be an object`)
  }
}

const validateStartAndEndPoints = (
  { startPoint, endPoint }: { startPoint: Point; endPoint: Point },
  name: string
) => {
  if (!isValidPoint(startPoint)) {
    throw new Error(`Bounding curve '${name}' startPoint must be a valid point`)
  }
  if (!isValidPoint(endPoint)) {
    throw new Error(`Bounding curve '${name}' endPoint must be a valid point`)
  }
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const validateT = (t: number) => {
  if (t < 0 || t > 1) {
    throw new Error(`t value must be between 0 and 1, but was '${t}'`)
  }
}

const validateCornerPoints = (boundingCurves: BoundingCurves) => {
  if (
    !getPointsAreSame(
      boundingCurves.top.startPoint,
      boundingCurves.left.startPoint
    )
  ) {
    throw new Error(
      `top curve startPoint and left curve startPoint must have same coordinates`
    )
  }

  if (
    !getPointsAreSame(
      boundingCurves.bottom.startPoint,
      boundingCurves.left.endPoint
    )
  ) {
    throw new Error(
      `bottom curve startPoint and left curve endPoint must have the same coordinates`
    )
  }

  if (
    !getPointsAreSame(
      boundingCurves.top.endPoint,
      boundingCurves.right.startPoint
    )
  ) {
    throw new Error(
      `top curve endPoint and right curve startPoint must have the same coordinates`
    )
  }
  if (
    !getPointsAreSame(
      boundingCurves.bottom.endPoint,
      boundingCurves.right.endPoint
    )
  ) {
    throw new Error(
      `bottom curve endPoint and right curve endPoint must have the same coordinates`
    )
  }
}

const validateCurves = (boundingCurves: BoundingCurves) => {
  mapObj((curve, name) => {
    validateCurve(curve, name)
    validateStartAndEndPoints(curve, name)
  }, boundingCurves)
}

const validateBoundingCurves = (boundingCurves: BoundingCurves) => {
  if (!isPlainObj(boundingCurves)) {
    throw new Error(
      `boundingCurves must be an object, but it was '${boundingCurves}'`
    )
  }

  validateCurves(boundingCurves)
  validateCornerPoints(boundingCurves)
}

const validateUV = (u: number, v: number) => {
  if (!isNumber(u)) {
    throw new Error(`u value must be a number, but was '${u}'`)
  }

  if (!isNumber(v)) {
    throw new Error(`v value must be a number, but was '${v}'`)
  }

  if (u < 0 || u > 1) {
    throw new Error(`u value must be between 0 and 1, but was '${u}'`)
  }

  if (v < 0 || v > 1) {
    throw new Error(`v value must be between 0 and 1, but was '${v}'`)
  }
}

const validateColumnsAndRows = (
  columns: UnprocessedSteps,
  rows: UnprocessedSteps
) => {
  if (!isInt(columns)) {
    if (isArray(columns)) {
      columns.map((column) => {
        if (!isInt(column) && !isPlainObj(column)) {
          throw new Error(
            `A column must be an integer or an object, but it was '${column}'`
          )
        }
      }, columns)
    } else {
      throw new Error(
        `columns must be an integer or an array, but it was '${columns}'`
      )
    }
  }

  if (!isInt(rows)) {
    if (isArray(rows)) {
      rows.map((row) => {
        if (!isInt(row) && !isPlainObj(row)) {
          throw new Error(
            `A row must be an integer or an object, but it was '${row}'`
          )
        }
      }, rows)
    } else {
      throw new Error(
        `rows must be an integer or an array, but it was '${rows}'`
      )
    }
  }
}

const validateFunction = (func: Function, name: string) => {
  if (!isFunction(func)) {
    throw new Error(`${name} must be a function`)
  }
}

// -----------------------------------------------------------------------------
// Arguments
// -----------------------------------------------------------------------------

export const validateGetSurfacePointArguments = (
  boundingCurves: BoundingCurves,
  u: number,
  v: number,
  interpolatePointOnCurve: InterpolatePointOnCurve
) => {
  validateBoundingCurves(boundingCurves)
  validateUV(u, v)
  validateFunction(interpolatePointOnCurve, 'interpolatePointOnCurve')
}

export const validateGetSurfaceIntersectionPointsArguments = (
  boundingCurves: BoundingCurves,
  columns: UnprocessedSteps,
  rows: UnprocessedSteps,
  interpolatePointOnCurve: InterpolatePointOnCurve
) => {
  validateBoundingCurves(boundingCurves)
  validateColumnsAndRows(columns, rows)
  validateFunction(interpolatePointOnCurve, 'interpolatePointOnCurve')
}

export const validateGetSurfaceCurvesArguments = (
  boundingCurves: BoundingCurves,
  columns: UnprocessedSteps,
  rows: UnprocessedSteps,
  interpolatePointOnCurve: InterpolatePointOnCurve,
  interpolateLineU: InterpolateLineU,
  interpolateLineV: InterpolateLineV
) => {
  validateBoundingCurves(boundingCurves)
  validateColumnsAndRows(columns, rows)
  validateFunction(interpolatePointOnCurve, 'interpolatePointOnCurve')
  validateFunction(interpolateLineU, 'interpolateLineU')
  validateFunction(interpolateLineV, 'interpolateLineV')
}

export const validategetSurfaceCurvesUArguments = (
  boundingCurves: BoundingCurves,
  columns: UnprocessedSteps,
  rows: UnprocessedSteps,
  interpolatePointOnCurve: InterpolatePointOnCurve,
  interpolateLineU: InterpolateLineU
) => {
  validateBoundingCurves(boundingCurves)
  validateColumnsAndRows(columns, rows)
  validateFunction(interpolatePointOnCurve, 'interpolatePointOnCurve')
  validateFunction(interpolateLineU, 'interpolateLineU')
}

export const validategetSurfaceCurvesVArguments = (
  boundingCurves: BoundingCurves,
  columns: UnprocessedSteps,
  rows: UnprocessedSteps,
  interpolatePointOnCurve: InterpolatePointOnCurve,
  interpolateLineV: InterpolateLineV
) => {
  validateBoundingCurves(boundingCurves)
  validateColumnsAndRows(columns, rows)
  validateFunction(interpolatePointOnCurve, 'interpolatePointOnCurve')
  validateFunction(interpolateLineV, 'interpolateLineV')
}
