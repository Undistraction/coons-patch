import { interpolatePointOnSurface } from '../pointOnSurface/bilinear'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const interpolateStraightLineOnXAxis = (
  boundingCurves,
  uStart,
  uSize,
  uEnd,
  vStart,
  interpolatePointOnCurve
) => {
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

export const interpolateStraightLineOnYAxis = (
  boundingCurves,
  uStart,
  uSize,
  uEnd,
  vStart,
  interpolatePointOnCurve
) => {
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
