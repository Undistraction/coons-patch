import { BoundingCurves, Curve, InterpolatePointOnCurve } from '../../types'
import { interpolatePointOnSurface } from '../pointOnSurface/bilinear'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

/**
 * Interpolates a straight line along the U direction of a surface defined
 * by bounding curves.
 *
 * @param {BoundingCurves} boundingCurves - An object containing curves that define the
 * surface boundaries.
 * @param {number} uStart - The starting parameter along the U direction.
 * @param {number} uSize - The size of the step along the U direction.
 * @param {number} uEnd - The ending parameter along the U direction.
 * @param {number} vStart - The starting parameter along the V direction.
 * @param {InterpolatePointOnCurve} interpolatePointOnCurve - A function to interpolate points on the curves.
 * @returns {Curve} The interpolated straight line as a cubic Bezier curve.
 */
export const interpolateStraightLineU = (
  boundingCurves: BoundingCurves,
  uStart: number,
  uSize: number,
  uEnd: number,
  vStart: number,
  interpolatePointOnCurve: InterpolatePointOnCurve
): Curve => {
  const startPoint = interpolatePointOnSurface(
    boundingCurves,
    vStart,
    uStart,
    interpolatePointOnCurve
  )

  const endPoint = interpolatePointOnSurface(
    boundingCurves,
    vStart,
    uEnd,
    interpolatePointOnCurve
  )

  // Set the control points to the start and end points so the line is straight
  return {
    startPoint,
    endPoint,
    controlPoint1: startPoint,
    controlPoint2: endPoint,
  }
}

/**
 * Interpolates a straight line along the V direction of a surface defined by
 * bounding curves.
 *
 * @param {BoundingCurves} boundingCurves - An object containing curves that
 * define the surface boundaries.
 * @param {number} uStart - The starting parameter along the U direction.
 * @param {number} uSize - The size of the step along the U direction.
 * @param {number} uEnd - The ending parameter along the U direction.
 * @param {number} vStart - The starting parameter along the V direction.
 * @param {InterpolatePointOnCurve} interpolatePointOnCurve - A function to
 * interpolate points on the curves.
 * @returns {Curve} The interpolated straight line as a cubic Bezier curve.
 */
export const interpolateStraightLineV = (
  boundingCurves: BoundingCurves,
  uStart: number,
  uSize: number,
  uEnd: number,
  vStart: number,
  interpolatePointOnCurve: InterpolatePointOnCurve
): Curve => {
  const startPoint = interpolatePointOnSurface(
    boundingCurves,
    uStart,
    vStart,
    interpolatePointOnCurve
  )

  const endPoint = interpolatePointOnSurface(
    boundingCurves,
    uEnd,
    vStart,
    interpolatePointOnCurve
  )

  // Set the control points to the start and end points so the line is straight
  return {
    startPoint,
    endPoint,
    controlPoint1: startPoint,
    controlPoint2: endPoint,
  }
}
