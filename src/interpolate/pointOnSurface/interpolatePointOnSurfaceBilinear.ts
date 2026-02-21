import type {
  BoundaryPoints,
  BoundingCurves,
  CornerPoints,
  InterpolatePointOnCurve,
  InterpolationParametersRequired,
  Point,
} from '../../types'
import { mapObjFast } from '../../utils/functional'
import { lerp } from '../pointOnCurve/interpolatePointOnCurveLinearFactory'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

// This is an implementation of a coons-patch, but it has a major difference.
// Instead of accepting only a u and v value, it also accepts uOpposite and
// vOpposite, allowing for much greater flexibility.
//
// Computes both x and y coordinates in a single pass to avoid repeated
// destructuring and string-indexed property access.
// Bilinear interpolation for a single coordinate on a surface.
// Edge influences are blended, then corner contributions are subtracted
// to avoid double counting (corners are included in the boundary curves).
const interpolateCoordinate = (
  topEdge: number,
  bottomEdge: number,
  leftEdge: number,
  rightEdge: number,
  topLeftCorner: number,
  topRightCorner: number,
  bottomLeftCorner: number,
  bottomRightCorner: number,
  uBlended: number,
  vBlended: number,
  oneMinusU: number,
  oneMinusV: number
): number =>
  oneMinusV * topEdge +
  vBlended * bottomEdge +
  oneMinusU * leftEdge +
  uBlended * rightEdge -
  oneMinusU * oneMinusV * topLeftCorner -
  uBlended * oneMinusV * topRightCorner -
  oneMinusU * vBlended * bottomLeftCorner -
  uBlended * vBlended * bottomRightCorner

const getPointOnSurface = (
  boundaryPoints: BoundaryPoints,
  cornerPoints: CornerPoints,
  params: InterpolationParametersRequired
): Point => {
  const { u, v, uOpposite, vOpposite } = params

  // Blend opposing params
  const uBlended = lerp(u, uOpposite, v)
  const vBlended = lerp(v, vOpposite, u)

  const oneMinusU = 1 - uBlended
  const oneMinusV = 1 - vBlended

  return {
    x: interpolateCoordinate(
      boundaryPoints.top.x,
      boundaryPoints.bottom.x,
      boundaryPoints.left.x,
      boundaryPoints.right.x,
      cornerPoints.topLeft.x,
      cornerPoints.topRight.x,
      cornerPoints.bottomLeft.x,
      cornerPoints.bottomRight.x,
      uBlended,
      vBlended,
      oneMinusU,
      oneMinusV
    ),
    y: interpolateCoordinate(
      boundaryPoints.top.y,
      boundaryPoints.bottom.y,
      boundaryPoints.left.y,
      boundaryPoints.right.y,
      cornerPoints.topLeft.y,
      cornerPoints.topRight.y,
      cornerPoints.bottomLeft.y,
      cornerPoints.bottomRight.y,
      uBlended,
      vBlended,
      oneMinusU,
      oneMinusV
    ),
  }
}

const clampT = (t: number): number => Math.min(Math.max(t, 0), 1)

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

/**
 * Interpolates a point on a surface using bilinear interpolation. All
 * interpolation parameters are clamped to the range 0–1 to avoid minor rounding
 * errors.
 *
 * @param {BoundingCurves} boundingCurves - The bounding curves of the surface
 * containing top, bottom, left and right curves.
 * @param {InterpolationParameters} params - The interpolation parameters.
 * @param {InterpolatePointOnCurve} interpolatePointOnCurveU - The function to
 * interpolate a point on the u-axis curves.
 * @param {InterpolatePointOnCurve} interpolatePointOnCurveV - The function to
 * interpolate a point on the v-axis curves.
 * @returns {Point} The interpolated 3D point on the surface {x, y, z}.
 */
const interpolatePointOnSurfaceBilinear = (
  { top, bottom, left, right }: BoundingCurves,
  params: InterpolationParametersRequired,
  interpolatePointOnCurveU: InterpolatePointOnCurve,
  interpolatePointOnCurveV: InterpolatePointOnCurve
): Point => {
  // Due to potential minute rounding errors we clamp these values to avoid
  // issues with the interpolators which expect a range of 0–1.
  const paramsClamped = mapObjFast<number, InterpolationParametersRequired>(
    clampT,
    params
  )

  const boundaryPoints: BoundaryPoints = {
    top: interpolatePointOnCurveU(paramsClamped.u, top),
    bottom: interpolatePointOnCurveU(paramsClamped.uOpposite, bottom),
    left: interpolatePointOnCurveV(paramsClamped.v, left),
    right: interpolatePointOnCurveV(paramsClamped.vOpposite, right),
  }

  const cornerPoints: CornerPoints = {
    topLeft: top.startPoint,
    topRight: top.endPoint,
    bottomLeft: bottom.startPoint,
    bottomRight: bottom.endPoint,
  }

  return getPointOnSurface(boundaryPoints, cornerPoints, paramsClamped)
}

export default interpolatePointOnSurfaceBilinear
