// -----------------------------------------------------------------------------
// Re-export Types
// -----------------------------------------------------------------------------

export * from './types'

// -----------------------------------------------------------------------------
// Re-export Interpolation functions
// -----------------------------------------------------------------------------

export {
  interpolateCurveU,
  interpolateCurveV,
} from './interpolate/curves/curved'
export {
  interpolateStraightLineU,
  interpolateStraightLineV,
} from './interpolate/curves/straight'
export { interpolatePointOnCurveEvenlySpaced } from './interpolate/pointOnCurve/even'
export { interpolatePointOnCurveLinear } from './interpolate/pointOnCurve/linear'

// -----------------------------------------------------------------------------
// Re-export API
// -----------------------------------------------------------------------------

export * from './api'
