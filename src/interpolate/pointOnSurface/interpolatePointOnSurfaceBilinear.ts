import type {
  BoundaryPoints,
  BoundingCurves,
  CornerPoints,
  GetCoordinateOnSurfaceConfig,
  InterpolatePointOnCurve,
  InterpolationParametersRequired,
  Point,
} from '../../types'
import { Coordinate } from '../../types'
import { mapObj } from '../../utils/functional'
import { lerp } from '../pointOnCurve/interpolatePointOnCurveLinearFactory'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

// This is an implementation of a coons-patch, but it has a major difference.
// Instead of accepting only a u and v value, it also accepts uOpposite and
// vOpposite, allowing for much greater flexibility.
const getCoordinateOnSurface = ({
  coordinateName,
  boundaryPoints,
  cornerPoints,
  params,
}: GetCoordinateOnSurfaceConfig) => {
  const { top, bottom, left, right } = boundaryPoints
  const { topLeft, topRight, bottomLeft, bottomRight } = cornerPoints
  const { u, v, uOpposite, vOpposite } = params

  // Blend opposing params
  const uBlended = lerp(u, uOpposite, v)
  const vBlended = lerp(v, vOpposite, u)

  return (
    // Bilinear interpolation for a point on a surface
    // Top edge influence
    (1 - vBlended) * top[coordinateName] +
    // Bottom edge influence
    vBlended * bottom[coordinateName] +
    // Left edge influence
    (1 - uBlended) * left[coordinateName] +
    // Right edge influence
    uBlended * right[coordinateName] -
    // Corner correction
    // The corner points are included in the boundary curves, so we need to
    // remove them to avoid double counting.
    (1 - uBlended) * (1 - vBlended) * topLeft[coordinateName] -
    uBlended * (1 - vBlended) * topRight[coordinateName] -
    (1 - uBlended) * vBlended * bottomLeft[coordinateName] -
    uBlended * vBlended * bottomRight[coordinateName]
  )
}

const getPointOnSurface = (
  boundaryPoints: BoundaryPoints,
  cornerPoints: CornerPoints,
  params: InterpolationParametersRequired
): Point => ({
  x: getCoordinateOnSurface({
    coordinateName: Coordinate.X,
    boundaryPoints,
    cornerPoints,
    params,
  }),
  y: getCoordinateOnSurface({
    coordinateName: Coordinate.Y,
    boundaryPoints,
    cornerPoints,
    params,
  }),
})

const clampT = (t: number): number => Math.min(Math.max(t, 0), 1)

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

/**
 * Interpolates a point on a surface using bilinear interpolation.
 * All interpolation parameters are clamped to the range 0–1 to avoid minor
 * rounding errors.
 *
 * @param {BoundingCurves} boundingCurves - The bounding curves of the surface containing top, bottom, left and right curves.
 * @param {InterpolationParameters} params - The interpolation parameters.
 * @param {InterpolatePointOnCurve} interpolatePointOnCurveU - The function to interpolate a point on the u-axis curves.
 * @param {InterpolatePointOnCurve} interpolatePointOnCurveV - The function to interpolate a point on the v-axis curves.
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
  const paramsClamped = mapObj<number, InterpolationParametersRequired>(
    clampT,
    params
  )

  const boundaryPoints = {
    top: interpolatePointOnCurveU(paramsClamped.u, top),
    bottom: interpolatePointOnCurveU(paramsClamped.uOpposite, bottom),
    left: interpolatePointOnCurveV(paramsClamped.v, left),
    right: interpolatePointOnCurveV(paramsClamped.vOpposite, right),
  }

  const cornerPoints = {
    bottomLeft: bottom.startPoint,
    bottomRight: bottom.endPoint,
    topLeft: top.startPoint,
    topRight: top.endPoint,
  }

  return getPointOnSurface(boundaryPoints, cornerPoints, paramsClamped)
}

export default interpolatePointOnSurfaceBilinear
