import memoize from 'fast-memoize'

import type { Curve, InterpolatePointOnCurve, Point } from '../../types'
import { times, timesReduce } from '../../utils/functional'
import { getDistanceBetweenPoints, roundTo10 } from '../../utils/math'
import { validateT } from '../../utils/validation'
import interpolatePointOnCurveLinearFactory from './interpolatePointOnCurveLinearFactory'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

// The interpolation doesn't accept any config, but to keep its API consistent
// it requires a call that returns the function we want.
const interpolatePointOnCurveLinear = interpolatePointOnCurveLinearFactory()

const PRECISION_DEFAULT = 20

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const getApproximatePointsOnCurve = (curve: Curve, precision: number) => {
  return times((idx) => {
    const ratio = idx / precision
    return interpolatePointOnCurveLinear(ratio, curve)
  }, precision + 1)
}

// Generate a LUT (Look Up Table) of the cumulative arc length
const getLut = (points: Point[]): number[] =>
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
      return interpolatePointOnCurveLinear(t, curve)
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
 * Factory function that receives a config object and returns a function for
 * interpolating a point on a curve using an an algorithm that results in more
 * evenly distributed points than the default implementation.
 *
 * @param {Object} config - Configuration options.
 * @param {number} config.precision - The precision of the calculation used in determining the distribution of points. Increasing this number improves the
 * accuracy at the cost of performance.
 * @returns {InterpolatePointOnCurve} A function that takes a parameter `t` and
 * a `curve`, and returns an interpolated point on the curve.
 *
 * @group Interpolation
 */
const interpolatePointOnCurveEvenlySpacedFactory = (
  // Get an approximation using an arbitrary number of points. Increase for
  // more accuracy at cost of performance
  { precision }: { precision: number } = { precision: PRECISION_DEFAULT }
): InterpolatePointOnCurve => {
  /**
   * Interpolates a point on the given curve at the specified parameter `t`,
   * where `t` is a value between 0 and 1 inclusive using an an algorithm that * results in more evenly distributed points than the default implementation.
   *
   * @param {number} t - The parameter along the curve, typically between 0 and
   * 1.
   * @param {Curve} curve - The curve on which to interpolate the point.
   * @returns {Point} The interpolated point on the curve.
   */
  const interpolatePointOnCurveEvenlySpaced = (
    t: number,
    curve: Curve
  ): Point => {
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

  return interpolatePointOnCurveEvenlySpaced
}

export default interpolatePointOnCurveEvenlySpacedFactory
