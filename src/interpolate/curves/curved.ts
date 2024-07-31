import { BoundingCurves, Curve, InterpolatePointOnCurve } from '../../types'
import { fitCubicBezierToPoints } from '../../utils/bezier'
import { interpolatePointOnSurface } from '../pointOnSurface/bilinear'
import { interpolateStraightLineU, interpolateStraightLineV } from './straight'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

const T_MIDPOINT_1 = 0.25
const T_MIDPOINT_2 = 0.75

export const interpolateCurveU = (
  boundingCurves: BoundingCurves,
  vStart: number,
  vSize: number,
  vEnd: number,
  uStart: number,
  interpolatePointOnCurve: InterpolatePointOnCurve
): Curve => {
  const { startPoint, endPoint } = interpolateStraightLineU(
    boundingCurves,
    vStart,
    vSize,
    vEnd,
    uStart,
    interpolatePointOnCurve
  )

  const midPoint1 = interpolatePointOnSurface(
    boundingCurves,
    uStart,
    vStart + vSize * T_MIDPOINT_1,
    interpolatePointOnCurve
  )

  const midPoint2 = interpolatePointOnSurface(
    boundingCurves,
    uStart,
    vStart + vSize * T_MIDPOINT_2,
    interpolatePointOnCurve
  )

  const curve = fitCubicBezierToPoints(
    [startPoint, midPoint1, midPoint2, endPoint],
    [0, T_MIDPOINT_1, T_MIDPOINT_2, 1]
  )

  return curve
}

export const interpolateCurveV = (
  boundingCurves: BoundingCurves,
  uStart: number,
  uSize: number,
  uEnd: number,
  vStart: number,
  interpolatePointOnCurve: InterpolatePointOnCurve
): Curve => {
  const { startPoint, endPoint } = interpolateStraightLineV(
    boundingCurves,
    uStart,
    uSize,
    uEnd,
    vStart,
    interpolatePointOnCurve
  )

  const midPoint1 = interpolatePointOnSurface(
    boundingCurves,
    uStart + uSize * T_MIDPOINT_1,
    vStart,
    interpolatePointOnCurve
  )

  const midPoint2 = interpolatePointOnSurface(
    boundingCurves,
    uStart + uSize * T_MIDPOINT_2,
    vStart,
    interpolatePointOnCurve
  )

  const curve = fitCubicBezierToPoints(
    [startPoint, midPoint1, midPoint2, endPoint],
    [0, T_MIDPOINT_1, T_MIDPOINT_2, 1]
  )

  return curve
}
