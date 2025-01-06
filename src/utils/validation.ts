import type {
  BoundingCurves,
  Curve,
  InterpolatePointOnCurve,
  InterpolationParameters,
  Point,
} from '../types'
import { mapObj } from './functional'
import { isFunction, isNumber, isPlainObj } from './is'
import { roundTo5 } from './math'

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

const validateCornerPoints = (boundingCurves: BoundingCurves): void => {
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

const validateCurves = (boundingCurves: BoundingCurves): void => {
  mapObj((curve, name) => {
    validateCurve(curve, name)
    validateStartAndEndPoints(curve, name)
  }, boundingCurves)
}

const validateBoundingCurves = (boundingCurves: BoundingCurves): void => {
  if (!isPlainObj(boundingCurves)) {
    throw new Error(
      `boundingCurves must be an object, but it was '${boundingCurves}'`
    )
  }

  validateCurves(boundingCurves)
  validateCornerPoints(boundingCurves)
}

const validateParams = (params: InterpolationParameters): void => {
  if (!isNumber(params.u)) {
    throw new Error(`params.u value must be a number, but was '${params.u}'`)
  }

  if (!isNumber(params.v)) {
    throw new Error(`params.v value must be a number, but was '${params.v}'`)
  }

  if (!isNumber(params.uOpposite)) {
    throw new Error(
      `params.uOpposite value must be a number, but was '${params.uOpposite}'`
    )
  }

  if (!isNumber(params.vOpposite)) {
    throw new Error(
      `params.vOpposite value must be a number, but was '${params.vOpposite}'`
    )
  }

  if (params.u < 0 || params.u > 1) {
    throw new Error(
      `params.u value must be between 0 and 1, but was '${params.u}'`
    )
  }

  if (params.v < 0 || params.v > 1) {
    throw new Error(
      `params.v value must be between 0 and 1, but was '${params.v}'`
    )
  }

  if (params.uOpposite < 0 || params.uOpposite > 1) {
    throw new Error(
      `params.uOpposite value must be between 0 and 1, but was '${params.uOpposite}'`
    )
  }

  if (params.vOpposite < 0 || params.vOpposite > 1) {
    throw new Error(
      `params.vOpposite value must be between 0 and 1, but was '${params.vOpposite}'`
    )
  }
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
  params: InterpolationParameters,
  interpolatePointOnCurveU: InterpolatePointOnCurve,
  interpolatePointOnCurveV: InterpolatePointOnCurve
): void => {
  validateBoundingCurves(boundingCurves)
  validateParams(params)
  validateFunction(interpolatePointOnCurveU, `interpolatePointOnCurveU`)
  validateFunction(interpolatePointOnCurveV, `interpolatePointOnCurveV`)
}
