import memoize from 'fast-memoize'
import { times, timesReduce } from '../../utils/functional'
import { getDistanceBetweenPoints, roundTo10 } from '../../utils/math'
import { validateT } from '../../utils/validation'
import { interpolatePointOnCurveLinear } from './linear'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const getApproximatePointsOnCurve = (curve, precision) => {
  return times((idx) => {
    const ratio = idx / precision
    return interpolatePointOnCurveLinear(ratio, curve)
  }, precision + 1)
}

// Generate a LUT (Look Up Table) of the cumulative arc length
const getLut = (points) =>
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

const findClosestPointOnCurve = (lut, curve, targetLength, precision) => {
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
}

// We only want to do this once per curve as it is very expensive so we memoize
const getLutForCurve = memoize((curve, precision) => {
  const points = getApproximatePointsOnCurve(curve, precision)
  return getLut(points)
})

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const interpolatePointOnCurveEvenlySpaced =
  (
    // Get an approximation using an arbitrary number of points. Increase for
    // more accuracy at cost of performance
    { precision } = {}
  ) =>
  (t, curve) => {
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
