import interpolatePointOnCurveEvenlySpacedFactory from './interpolate/pointOnCurve/interpolatePointOnCurveEvenlySpacedFactory'
import interpolatePointOnSurfaceBilinear from './interpolate/pointOnSurface/interpolatePointOnSurfaceBilinear'
import { BoundingCurves, CoonsPatchConfig } from './types'
import { validateCoonsPatchArguments } from './utils/validation'

/**
 * @groupDescription API
 * Access information about a coons patch defined by four bounding curves.
 *
 *
 * @groupDescription Interpolation
 * Functions used to interpolate points on curves and surfaces.
 */

// -----------------------------------------------------------------------------
// Re-export types
// -----------------------------------------------------------------------------

export type {
  BoundingCurves,
  CoonsPatchConfig,
  Curve,
  InterpolatePointOnCurve,
  InterpolatePointOnCurveFactory,
  Point,
} from './types'

// -----------------------------------------------------------------------------
// Re-export Interpolation functions
// -----------------------------------------------------------------------------

export { default as interpolatePointOnCurveEvenlySpacedFactory } from './interpolate/pointOnCurve/interpolatePointOnCurveEvenlySpacedFactory'
export { default as interpolatePointOnCurveLinearFactory } from './interpolate/pointOnCurve/interpolatePointOnCurveLinearFactory'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

const interpolatePointOnCurveDefault =
  interpolatePointOnCurveEvenlySpacedFactory()

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

/**
 * Computes a point on a surface defined by bounding curves at parameters u and
 * v.
 *
 * @param {BoundingCurves} boundingCurves - An object containing curves that
 * define the surface boundaries.
 * @param {number} u - The parameter along the first dimension (0–1).
 * @param {number} v - The parameter along the second dimension (0–1).
 * @param {Object} [config] - Configuration object.
 * @param {Function}
 * [config.interpolatePointOnCurveU=interpolatePointOnCurveDefault] - A function
 * to interpolate points along the U axis.
 * @param {Function}
 * [config.interpolatePointOnCurveV=interpolatePointOnCurveDefault] - A function
 * to interpolate points along the V axis.
 * @returns {Point} The interpolated point on the surface.
 * @throws {Error} If the arguments are invalid.
 *
 * @group API
 */
const coonsPatch = (
  boundingCurves: BoundingCurves,
  u: number,
  v: number,
  {
    interpolatePointOnCurveU = interpolatePointOnCurveDefault,
    interpolatePointOnCurveV = interpolatePointOnCurveDefault,
  }: CoonsPatchConfig = {}
) => {
  validateCoonsPatchArguments(
    boundingCurves,
    u,
    v,
    interpolatePointOnCurveU,
    interpolatePointOnCurveV
  )

  return interpolatePointOnSurfaceBilinear(
    boundingCurves,
    u,
    v,
    interpolatePointOnCurveU,
    interpolatePointOnCurveV
  )
}

export default coonsPatch
