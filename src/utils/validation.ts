import { ValidationError } from '../errors/ValidationError'
import type {
  BoundingCurves,
  Curve,
  InterpolatePointOnCurve,
  InterpolationParametersRequired,
  Point,
} from '../types'
import { mapObj } from './functional'
import { isFunction, isNumber, isPlainObj } from './is'
import { roundTo5 } from './math'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

const CURVE_NAMES = [`top`, `right`, `bottom`, `left`]

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const roundPointCoordinates = (point: Point): Point => {
  return {
    ...point,
    x: roundTo5(point.x),
    y: roundTo5(point.x),
  }
}

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

const validateCurve = (curve: Curve, name: string): void => {
  if (!isPlainObj(curve)) {
    throw new Error(`Curve '${name}' must be an object`)
  }
}

const validateStartAndEndPoints = (
  { startPoint, endPoint }: { startPoint: Point; endPoint: Point },
  name: string
): void => {
  if (!isValidPoint(startPoint)) {
    throw new Error(`Bounding curve '${name}' startPoint must be a valid point`)
  }
  if (!isValidPoint(endPoint)) {
    throw new Error(`Bounding curve '${name}' endPoint must be a valid point`)
  }
}

const validateCurves = (boundingCurves: BoundingCurves): void => {
  CURVE_NAMES.map((name) => {
    const curve = boundingCurves[name as keyof BoundingCurves]
    validateCurve(curve, name)
    validateStartAndEndPoints(curve, name)
  })
}

const validateCornerPoints = (boundingCurves: BoundingCurves): void => {
  if (
    !getPointsAreSame(
      boundingCurves.top.startPoint,
      boundingCurves.left.startPoint
    )
  ) {
    throw new ValidationError(
      `top curve startPoint and left curve startPoint must have same coordinates`
    )
  }

  if (
    !getPointsAreSame(
      boundingCurves.bottom.startPoint,
      boundingCurves.left.endPoint
    )
  ) {
    throw new ValidationError(
      `bottom curve startPoint and left curve endPoint must have the same coordinates`
    )
  }

  if (
    !getPointsAreSame(
      boundingCurves.top.endPoint,
      boundingCurves.right.startPoint
    )
  ) {
    throw new ValidationError(
      `top curve endPoint and right curve startPoint must have the same coordinates`
    )
  }
  if (
    !getPointsAreSame(
      boundingCurves.bottom.endPoint,
      boundingCurves.right.endPoint
    )
  ) {
    throw new ValidationError(
      `bottom curve endPoint and right curve endPoint must have the same coordinates`
    )
  }
}

const validateBoundingCurves = (boundingCurves: BoundingCurves): void => {
  if (!isPlainObj(boundingCurves)) {
    throw new ValidationError(
      `boundingCurves must be an object, but it was '${boundingCurves}'`
    )
  }

  validateCurves(boundingCurves)
  validateCornerPoints(boundingCurves)
}

const validateParams = (params: InterpolationParametersRequired): void => {
  mapObj<undefined, InterpolationParametersRequired>(
    (value: number, name: string) => {
      if (!isNumber(value)) {
        throw new ValidationError(
          `params.${name} value must be a number, but was '${value}'`
        )
      }

      if (value < 0 || value > 1) {
        throw new ValidationError(
          `params.${name} value must be between 0 and 1, but was '${value}'`
        )
      }
    },
    params
  )
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const validateFunction = (func: Function, name: string): void => {
  if (!isFunction(func)) {
    throw new Error(`${name} must be a function`)
  }
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const validateT = (t: number): void => {
  if (t < 0 || t > 1) {
    throw new Error(`t value must be between 0 and 1, but was '${t}'`)
  }
}

export const validateCoonsPatchArguments = (
  boundingCurves: BoundingCurves,
  params: InterpolationParametersRequired,
  interpolatePointOnCurveU: InterpolatePointOnCurve,
  interpolatePointOnCurveV: InterpolatePointOnCurve
): void => {
  validateBoundingCurves(boundingCurves)
  validateParams(params)
  validateFunction(interpolatePointOnCurveU, `interpolatePointOnCurveU`)
  validateFunction(interpolatePointOnCurveV, `interpolatePointOnCurveV`)
}
