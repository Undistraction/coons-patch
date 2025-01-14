import type { Curve, Point } from '../../types'
import { roundTo10 } from '../../utils/math'
import { validateT } from '../../utils/validation'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

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

/**
 * Performs linear interpolation between two values.
 * @param value1 - The first value to interpolate from
 * @param value2 - The second value to interpolate to
 * @param t - The interpolation parameter between 0 and 1
 * @returns The interpolated value
 */
export const lerp = (value1: number, value2: number, t: number) =>
  (1 - t) * value1 + t * value2

/**
 * Factory function that returns a function for interpolating a point on a
 * curve using the simplest possible algorithm.
 *
 * @returns {InterpolatePointOnCurve} A function that takes a parameter `t` and
 * a `curve`, and returns an interpolated point on the curve.
 *
 * @group Interpolation
 */
const interpolatePointOnCurveLinearFactory = () => {
  /**
   * Interpolates a point on the given curve at the specified parameter `t`,
   * where `t` is a value between 0 and 1 inclusive.
   *
   * @param {number} t - The parameter along the curve, typically between 0 and
   * 1.
   * @param {Curve} curve - The curve on which to interpolate the point.
   * @returns {Point} The interpolated point on the curve.
   */
  const interpolatePointOnCurveLinear = (t: number, curve: Curve): Point => {
    // Round the ratio to 10 decimal places to avoid rounding issues where the
    // number is fractionally over 1 or below 0
    const tRounded = roundTo10(t)
    validateT(tRounded)

    return interpolate(t, curve)
  }

  return interpolatePointOnCurveLinear
}

export default interpolatePointOnCurveLinearFactory
