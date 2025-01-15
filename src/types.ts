// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

/**
 * Represents a 2D point with x and y coordinates.
 */
export interface Point {
  x: number
  y: number
}

/**
 * Represents a cubic Bezier curve in 2D space
 * the curve's shape
 */
export interface Curve {
  startPoint: Point
  endPoint: Point
  controlPoint1: Point
  controlPoint2: Point
}

/**
 * Interface representing the boundary curves of a surface patch.
 */
export interface BoundingCurves {
  top: Curve
  bottom: Curve
  left: Curve
  right: Curve
}

/**
 * Parameters for interpolating points within a Coons patch.
 */
export interface InterpolationParameters {
  u: number
  v: number
  uOpposite?: number
  vOpposite?: number
}

/**
 * Configuration interface for a Coons patch
 * @interface CoonsPatchConfig
 * @property {InterpolatePointOnCurve} [interpolatePointOnCurveU] - Optional
 * function to interpolate points along U parameter direction
 * @property {InterpolatePointOnCurve} [interpolatePointOnCurveV] - Optional
 * function to interpolate points along V parameter direction
 */
export interface CoonsPatchConfig {
  interpolatePointOnCurveU?: InterpolatePointOnCurve
  interpolatePointOnCurveV?: InterpolatePointOnCurve
}

/**
 * Type definition for a function that interpolates a point on a curve.
 * @param t - The interpolation parameter, between 0 and 1
 * @param curve - The curve to interpolate along
 * @returns A point on the curve at parameter t
 *
 * @group Interpolation
 */
export type InterpolatePointOnCurve = (t: number, curve: Curve) => Point

/**
 * Factory function type that creates an interpolation function for
 * interpolating a point on a curve. curve.
 * @param {Object} config - The configuration object.
 * @param {number} config.precision - The precision level for the interpolation.
 * @returns {InterpolatePointOnCurve} A function that interpolates a point on a
 * curve.
 *
 * @group Interpolation
 */
export type InterpolatePointOnCurveFactory = (config: {
  precision: number
}) => InterpolatePointOnCurve

// -----------------------------------------------------------------------------
// Internal
// -----------------------------------------------------------------------------
export enum Coordinate {
  X = `x`,
  Y = `y`,
}
export interface BoundaryPoints {
  top: Point
  bottom: Point
  left: Point
  right: Point
}

export interface CornerPoints {
  topLeft: Point
  topRight: Point
  bottomLeft: Point
  bottomRight: Point
}

export type InterpolationParametersRequired = Required<InterpolationParameters>

export interface GetCoordinateOnSurfaceConfig {
  coordinateName: Coordinate
  boundaryPoints: BoundaryPoints
  cornerPoints: CornerPoints
  params: InterpolationParametersRequired
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type ObjectWithStringKeys = Record<string, any>
