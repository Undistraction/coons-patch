import memoize from 'fast-memoize'

import { Curve, InterpolatePointOnCurve, Point, Points } from '../../types'
import { times, timesReduce } from '../../utils/functional'
import { getDistanceBetweenPoints, roundTo10 } from '../../utils/math'
import { validateT } from '../../utils/validation'
import interpolatePointOnCurveLinear from './interpolatePointOnCurveLinear'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

// The interpolation doesn't accept any config, but to keep its API consistent
// it requires a call that returns the function we want.
const interpolatePointOnCurveLinearWithConfig = interpolatePointOnCurveLinear()

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const getApproximatePointsOnCurve = (curve: Curve, precision: number) => {
  return times((idx) => {
    const ratio = idx / precision
    return interpolatePointOnCurveLinearWithConfig(ratio, curve)
  }, precision + 1)
}

// Generate a LUT (Look Up Table) of the cumulative arc length
const getLut = (points: Points): number[] =>
  timesReduce(
    (acc, idx) => {
      const point = points[idx]
      const nextPoint = points[idx + 1]
      const distanceBetweenPoints = getDistanceBetweenPoints(point, nextPoint)
      const lastValue = acc[idx]
      const nextValue = lastValue + distanceBetweenPoints
      return [...acc, nextValue]
    },
    [0],
    points.length - 1
  )

const findClosestPointOnCurve = (
  lut: number[],
  curve: Curve,
  targetLength: number,
  precision: number
): Point => {
  for (let i = 1; i < lut.length; i++) {
    const point = lut[i]
    if (point >= targetLength) {
      const previousIdx = i - 1
      const lastPoint = lut[previousIdx]
      const t =
        (previousIdx + (targetLength - lastPoint) / (point - lastPoint)) /
        precision
      return interpolatePointOnCurveLinearWithConfig(t, curve)
    }
  }
  throw new Error(`Could not find point on curve`)
}

// We only want to do this once per curve as it is very expensive so we memoize
const getLutForCurve = memoize((curve, precision) => {
  const points = getApproximatePointsOnCurve(curve, precision)
  return getLut(points)
})

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

/**
 * Interpolates a point on a curve such that the points are evenly spaced.
 *
 * @param {Object} options - Configuration options.
 * @param {number} options.precision - The number of points used to approximate
 * the curve. Increasing this number improves accuracy at the cost of
 * performance.
 * @returns {Function} A function that takes a parameter `t` and a `curve`, and
 * returns an interpolated point on the curve.
 *
 * @group Interpolation
 */
const interpolatePointOnCurveEvenlySpaced =
  (
    // Get an approximation using an arbitrary number of points. Increase for
    // more accuracy at cost of performance
    config: { precision: number }
  ): InterpolatePointOnCurve =>
  (t: number, curve: Curve): Point => {
    const { precision } = config

    // Round the ratio to 10 decimal places to avoid rounding issues where the
    // number is fractionally over 1 or below 0
    const tRounded = roundTo10(t)

    validateT(tRounded)

    const lut = getLutForCurve(curve, precision)
    const totalLength = lut[lut.length - 1]
    const targetLength = t * totalLength

    // Interpolate new point based on the cumulative arc length
    return findClosestPointOnCurve(lut, curve, targetLength, precision)
  }

export default interpolatePointOnCurveEvenlySpaced
