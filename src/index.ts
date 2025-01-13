import { ValidationError } from './errors/ValidationError'
import interpolatePointOnCurveEvenlySpacedFactory from './interpolate/pointOnCurve/interpolatePointOnCurveEvenlySpacedFactory'
import interpolatePointOnSurfaceBilinear from './interpolate/pointOnSurface/interpolatePointOnSurfaceBilinear'
import {
  BoundingCurves,
  CoonsPatchConfig,
  InterpolationParameters,
  InterpolationParametersRequired,
} from './types'
import { isPlainObj } from './utils/is'
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
  InterpolationParameters,
} from './types'

export { ValidationError } from './errors/ValidationError'

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
 * Computes a point on a surface defined by four bounding curves using the Coons patch formula.
 * This interpolation method ensures a smooth transition between the boundary curves.
 *
 * @param {BoundingCurves} boundingCurves - An object containing the four curves that define the surface boundaries.
 * @param {InterpolationParameters} params - The `u`, `v`, `uOpposite` and `vOpposite` parameters for interpolation. All parameters should be in range [0-1]. `uOpposite` defaults to `u`, and `vOpposite` defaults to `v`.
 * @param {CoonsPatchConfig} [config] - Optional configuration object to customize curve interpolation methods.
 * @returns {Point} The interpolated 2D point on the surface.
 * @throws {ValidationError} If bounding curves or params are invalid.
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
  if (!isPlainObj(params)) {
    throw new ValidationError(
      `params must be an object, but it was '${params}'`
    )
  }

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
