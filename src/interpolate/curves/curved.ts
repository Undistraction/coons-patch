import { BoundingCurves, Curve, InterpolatePointOnCurve } from '../../types'
import { fitCubicBezierToPoints } from '../../utils/bezier'
import { interpolatePointOnSurface } from '../pointOnSurface/bilinear'
import { interpolateStraightLineU, interpolateStraightLineV } from './straight'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

const T_MIDPOINT_1 = 0.25
const T_MIDPOINT_2 = 0.75

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

/**
 * Interpolates a cubic Bezier curve along the U direction of a surface defined
 * by bounding curves.
 *
 * @param {BoundingCurves} boundingCurves - An object containing curves that
 * define the surface boundaries.
 * @param {number} vStart - The starting parameter along the V direction.
 * @param {number} vSize - The size of the step along the V direction.
 * @param {number} vEnd - The ending parameter along the V direction.
 * @param {number} uStart - The starting parameter along the U direction.
 * @param {InterpolatePointOnCurve} interpolatePointOnCurve - A function to
 * interpolate points on the curves.
 * @returns {Curve} The interpolated cubic Bezier curve.
 */
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

/**
 * Interpolates a cubic Bezier curve along the V direction of a surface defined
 * by bounding curves.
 *
 * @param {BoundingCurves} boundingCurves - An object containing curves that
 * define the surface boundaries.
 * @param {number} uStart - The starting parameter along the U direction.
 * @param {number} uSize - The size of the step along the U direction.
 * @param {number} uEnd - The ending parameter along the U direction.
 * @param {number} vStart - The starting parameter along the V direction.
 * @param {InterpolatePointOnCurve} interpolatePointOnCurve - A function to
 * interpolate points on the curves.
 * @returns {Curve} The interpolated cubic Bezier curve.
 */
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
