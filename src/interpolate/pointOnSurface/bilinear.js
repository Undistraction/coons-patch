import { COORDINATE } from '../../const'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const getCoordinateOnSurface = ({
  coordinateName,
  boundaryPoints: {
    pointOnTopBoundary,
    pointOnBottomBoundary,
    pointOnLeftBoundary,
    pointOnRightBoundary,
  },
  cornerPoints: {
    cornerPointTopLeft,
    cornerPointTopRight,
    cornerPointBottomLeft,
    cornerPointBottomRight,
  },
  u,
  v,
}) => {
  return (
    (1 - v) * pointOnTopBoundary[coordinateName] +
    v * pointOnBottomBoundary[coordinateName] +
    (1 - u) * pointOnLeftBoundary[coordinateName] +
    u * pointOnRightBoundary[coordinateName] -
    (1 - u) * (1 - v) * cornerPointTopLeft[coordinateName] -
    u * (1 - v) * cornerPointTopRight[coordinateName] -
    (1 - u) * v * cornerPointBottomLeft[coordinateName] -
    u * v * cornerPointBottomRight[coordinateName]
  )
}

const clampT = (t) => Math.min(Math.max(t, 0), 1)

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const interpolatePointOnSurface = (
  { top, bottom, left, right },
  u,
  v,
  interpolatePointOnCurve
) => {
  // Due to potential minute rounding errors we clamp these values to avoid
  // issues with the interpolators which expect a range of 0–1.
  const uResolved = clampT(u)
  const vResolved = clampT(v)

  const boundaryPoints = {
    pointOnTopBoundary: interpolatePointOnCurve(uResolved, top),
    pointOnBottomBoundary: interpolatePointOnCurve(uResolved, bottom),
    pointOnLeftBoundary: interpolatePointOnCurve(vResolved, left),
    pointOnRightBoundary: interpolatePointOnCurve(vResolved, right),
  }

  const cornerPoints = {
    cornerPointBottomLeft: bottom.startPoint,
    cornerPointBottomRight: bottom.endPoint,
    cornerPointTopLeft: top.startPoint,
    cornerPointTopRight: top.endPoint,
  }

  return {
    x: getCoordinateOnSurface({
      coordinateName: COORDINATE.X,
      boundaryPoints,
      cornerPoints,
      u,
      v,
    }),
    y: getCoordinateOnSurface({
      coordinateName: COORDINATE.Y,
      boundaryPoints,
      cornerPoints,
      u,
      v,
    }),
  }
}
