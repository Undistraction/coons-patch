import interpolatePointOnCurveEvenlySpacedFactory from './interpolate/pointOnCurve/interpolatePointOnCurveEvenlySpacedFactory'
import interpolatePointOnSurfaceBilinear from './interpolate/pointOnSurface/interpolatePointOnSurfaceBilinear'
import {
  BoundingCurves,
  CoonsPatchConfig,
  InterpolationParameters,
  InterpolationParametersRequired,
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
  InterpolationParameters,
  InterpolationParametersRequired,
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
 * Computes a point on a surface defined by bounding curves at parameters u, v,
 * uOpposite, and vOpposite. If uOpposite and vOpposite are not provided, they
 * default to u and v, respectively.
 *
 * @param {BoundingCurves} boundingCurves - An object containing curves that define the surface boundaries.
 * @param {InterpolationParameters} params - The interpolation parameters.
 * @param {CoonsPatchConfig} [config] - Configuration object.
 * @returns {Point} The interpolated point on the surface.
 * @throws {Error} If boundingCurves is invalid or missing required curves.
 * @throws {Error} If params contains values outside the valid range [0-1].
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
  console.log(`Coons patch version with fixed params`)
  const paramsWithDefaults: InterpolationParametersRequired = {
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
