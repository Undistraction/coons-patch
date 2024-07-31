import { Curve, Point } from '../../types'
import { roundTo10 } from '../../utils/math'
import { validateT } from '../../utils/validation'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const lerp = (value1: number, value2: number, t: number) => {
  return (1 - t) * value1 + t * value2
}

const lerpPoint = (point1: Point, point2: Point, t: number): Point => {
  return { x: lerp(point1.x, point2.x, t), y: lerp(point1.y, point2.y, t) }
}

// Alternativly we could use Bernstein polynomials for interpolation
// return (
//   startPoint[coordinateName] * (-tCubed + 3 * tSquared - 3 * t + 1) +
//   controlPoint1[coordinateName] * (3 * tCubed - 6 * tSquared + 3 * t) +
//   controlPoint2[coordinateName] * (-3 * tCubed + 3 * tSquared) +
//   endPoint[coordinateName] * tCubed
// )
const interpolate = (
  t: number,
  { controlPoint1, controlPoint2, startPoint, endPoint }: Curve
): Point => {
  const point1 = lerpPoint(startPoint, controlPoint1, t)
  const point2 = lerpPoint(controlPoint1, controlPoint2, t)
  const point3 = lerpPoint(controlPoint2, endPoint, t)
  const point4 = lerpPoint(point1, point2, t)
  const point5 = lerpPoint(point2, point3, t)
  return lerpPoint(point4, point5, t)
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const interpolatePointOnCurveLinear = (
  t: number,
  curve: Curve
): Point => {
  // Round the ratio to 10 decimal places to avoid rounding issues where the
  // number is fractionally over 1 or below 0
  const tRounded = roundTo10(t)
  validateT(tRounded)

  return {
    ...interpolate(t, curve),
    t,
  }
}
