import { roundTo10 } from '../../utils/math'
import { validateT } from '../../utils/validation'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const lerp = (point1, point2, t) => {
  return (1 - t) * point1 + t * point2
}

const lerpPoint = (point1, point2, t) => {
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
  t,
  { controlPoint1, controlPoint2, startPoint, endPoint }
) => {
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

export const interpolatePointOnCurveLinear = (t, curve) => {
  // Round the ratio to 10 decimal places to avoid rounding issues where the
  // number is fractionally over 1 or below 0
  const tRounded = roundTo10(t)
  validateT(tRounded)

  return {
    ...interpolate(t, curve),
    t,
  }
}
