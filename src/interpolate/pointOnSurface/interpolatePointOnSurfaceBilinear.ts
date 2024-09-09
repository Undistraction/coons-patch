import {
  BoundingCurves,
  Coordinate,
  GetCoordinateOnSurfaceConfig,
  InterpolatePointOnCurve,
  Point,
} from '../../types'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const getCoordinateOnSurface = ({
  coordinateName,
  boundaryPoints,
  cornerPoints,
  u,
  v,
}: GetCoordinateOnSurfaceConfig) => {
  return (
    (1 - v) * boundaryPoints.top[coordinateName] +
    v * boundaryPoints.bottom[coordinateName] +
    (1 - u) * boundaryPoints.left[coordinateName] +
    u * boundaryPoints.right[coordinateName] -
    (1 - u) * (1 - v) * cornerPoints.topLeft[coordinateName] -
    u * (1 - v) * cornerPoints.topRight[coordinateName] -
    (1 - u) * v * cornerPoints.bottomLeft[coordinateName] -
    u * v * cornerPoints.bottomRight[coordinateName]
  )
}

const clampT = (t: number): number => Math.min(Math.max(t, 0), 1)

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

const interpolatePointOnSurfaceBilinear = (
  { top, bottom, left, right }: BoundingCurves,
  u: number,
  v: number,
  interpolatePointOnCurveU: InterpolatePointOnCurve,
  interpolatePointOnCurveV: InterpolatePointOnCurve
): Point => {
  // Due to potential minute rounding errors we clamp these values to avoid
  // issues with the interpolators which expect a range of 0–1.
  const uResolved = clampT(u)
  const vResolved = clampT(v)

  const boundaryPoints = {
    top: interpolatePointOnCurveU(uResolved, top),
    bottom: interpolatePointOnCurveU(uResolved, bottom),
    left: interpolatePointOnCurveV(vResolved, left),
    right: interpolatePointOnCurveV(vResolved, right),
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
      u,
      v,
    }),
    y: getCoordinateOnSurface({
      coordinateName: Coordinate.Y,
      boundaryPoints,
      cornerPoints,
      u,
      v,
    }),
  }
}

export default interpolatePointOnSurfaceBilinear
