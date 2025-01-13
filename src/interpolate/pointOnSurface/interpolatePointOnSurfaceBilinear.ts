import type {
  BoundaryPoints,
  BoundingCurves,
  CornerPoints,
  GetCoordinateOnSurfaceConfig,
  InterpolatePointOnCurve,
  InterpolationParameters,
  InterpolationParametersRequired,
  Point,
} from '../../types'
import { Coordinate } from '../../types'
import { isNil } from '../../utils/is'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const getCoordinateOnSurface = ({
  coordinateName,
  boundaryPoints,
  cornerPoints,
  params,
}: GetCoordinateOnSurfaceConfig) => {
  const { u, v } = params

  const { top, bottom, left, right } = boundaryPoints
  const { topLeft, topRight, bottomLeft, bottomRight } = cornerPoints

  return (
    (1 - v) * top[coordinateName] +
    v * bottom[coordinateName] +
    (1 - u) * left[coordinateName] +
    u * right[coordinateName] -
    (1 - u) * (1 - v) * topLeft[coordinateName] -
    u * (1 - v) * topRight[coordinateName] -
    (1 - u) * v * bottomLeft[coordinateName] -
    u * v * bottomRight[coordinateName]
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
  params: InterpolationParameters,
  interpolatePointOnCurveU: InterpolatePointOnCurve,
  interpolatePointOnCurveV: InterpolatePointOnCurve
): Point => {
  const uOpposite = isNil(params.uOpposite) ? params.u : params.uOpposite
  const vOpposite = isNil(params.vOpposite) ? params.v : params.vOpposite

  // Due to potential minute rounding errors we clamp these values to avoid
  // issues with the interpolators which expect a range of 0–1.
  const paramsClamped = {
    u: clampT(params.u),
    uOpposite: clampT(uOpposite),
    v: clampT(params.v),
    vOpposite: clampT(vOpposite),
  } as InterpolationParametersRequired

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
