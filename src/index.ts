import interpolatePointOnCurveEvenlySpacedFactory from './interpolate/pointOnCurve/interpolatePointOnCurveEvenlySpacedFactory'
import interpolatePointOnSurfaceBilinear from './interpolate/pointOnSurface/interpolatePointOnSurfaceBilinear'
import {
  BoundingCurves,
  CoonsPatchConfig,
  InterpolationParameters,
} from './types'
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
  Points,
} from './types'

// -----------------------------------------------------------------------------
// Re-export Interpolation functions
// -----------------------------------------------------------------------------

export { default as interpolatePointOnCurveEvenlySpacedFactory } from './interpolate/pointOnCurve/interpolatePointOnCurveEvenlySpacedFactory'
export { default as interpolatePointOnCurveLinearFactory } from './interpolate/pointOnCurve/interpolatePointOnCurveLinearFactory'
export { default as interpolatePointOnSurfaceBilinear } from './interpolate/pointOnSurface/interpolatePointOnSurfaceBilinear'

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
 * @param {CoonsPatchConfig} [config] - Configuration object.
 * @returns {Point} The interpolated point on the surface.
 * @throws {Error} If the arguments are invalid.
 *
 * @group API
 */
const coonsPatch = (
  boundingCurves: BoundingCurves,
  params: InterpolationParameters,
  {
    interpolatePointOnCurveU = interpolatePointOnCurveDefault,
    interpolatePointOnCurveV = interpolatePointOnCurveDefault,
  }: CoonsPatchConfig = {}
) => {
  const paramsWithDefaults = {
    u: params.u,
    uOpposite: params.uOpposite || params.u,
    v: params.v,
    vOpposite: params.vOpposite || params.v,
  }
  validateCoonsPatchArguments(
    boundingCurves,
    paramsWithDefaults,
    interpolatePointOnCurveU,
    interpolatePointOnCurveV
  )

  return interpolatePointOnSurfaceBilinear(
    boundingCurves,
    paramsWithDefaults,
    interpolatePointOnCurveU,
    interpolatePointOnCurveV
  )
}

export default coonsPatch
