import type {
  BoundingCurves,
  GetCoordinateOnSurfaceConfig,
  InterpolatePointOnCurve,
  InterpolationParameters,
  Point,
} from '../../types'
import { Coordinate } from '../../types'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const getCoordinateOnSurface = ({
  coordinateName,
  boundaryPoints,
  cornerPoints,
  params,
}: GetCoordinateOnSurfaceConfig) => {
  const { u, uOpposite, v, vOpposite } = params

  return (
    (1 - v) * boundaryPoints.top[coordinateName] +
    vOpposite * boundaryPoints.bottom[coordinateName] +
    (1 - u) * boundaryPoints.left[coordinateName] +
    uOpposite * boundaryPoints.right[coordinateName] -
    (1 - u) * (1 - v) * cornerPoints.topLeft[coordinateName] -
    uOpposite * (1 - vOpposite) * cornerPoints.topRight[coordinateName] -
    (1 - u) * v * cornerPoints.bottomLeft[coordinateName] -
    uOpposite * vOpposite * cornerPoints.bottomRight[coordinateName]
  )
}

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
  params: InterpolationParameters,
  interpolatePointOnCurveU: InterpolatePointOnCurve,
  interpolatePointOnCurveV: InterpolatePointOnCurve
): Point => {
  // Due to potential minute rounding errors we clamp these values to avoid
  // issues with the interpolators which expect a range of 0–1.
  const paramsClamped = {
    u: clampT(params.u),
    uOpposite: clampT(params.uOpposite),
    v: clampT(params.v),
    vOpposite: clampT(params.vOpposite),
  }

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

  return {
    x: getCoordinateOnSurface({
      coordinateName: Coordinate.X,
      boundaryPoints,
      cornerPoints,
      params: paramsClamped,
    }),
    y: getCoordinateOnSurface({
      coordinateName: Coordinate.Y,
      boundaryPoints,
      cornerPoints,
      params: paramsClamped,
    }),
  }
}

export default interpolatePointOnSurfaceBilinear
