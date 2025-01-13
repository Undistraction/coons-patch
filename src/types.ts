// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export enum Coordinate {
  X = `x`,
  Y = `y`,
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

/**
 * Represents a 2D point with x and y coordinates.
 * @interface Point
 * @property {number} x - The x-coordinate of the point
 * @property {number} y - The y-coordinate of the point
 */
export interface Point {
  x: number
  y: number
}

/**
 * Represents a cubic Bezier curve in 2D space
 * @interface Curve
 * @property {Point} startPoint - The starting point of the curve
 * @property {Point} endPoint - The ending point of the curve
 * @property {Point} controlPoint1 - The first control point that influences the
 * curve's shape
 * @property {Point} controlPoint2 - The second control point that influences
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
 * @interface BoundingCurves
 * @property {Curve} top - The curve defining the top boundary
 * @property {Curve} bottom - The curve defining the bottom boundary
 * @property {Curve} left - The curve defining the left boundary
 * @property {Curve} right - The curve defining the right boundary
 */
export interface BoundingCurves {
  top: Curve
  bottom: Curve
  left: Curve
  right: Curve
}

/**
 * Parameters for interpolating points within a Coons patch.
 * @interface InterpolationParameters
 *
 * @property {number} u - Parameter value along the top edge (0 to 1)
 * @property {number} v - Parameter value along the left edge (0 to 1)
 * @property {number} [uOpposite] - Optional parameter value along the bottom
 * edge (0 to 1)
 * @property {number} [vOpposite] - Optional parameter value along the right
 * edge (0 to 1)
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
 */
export type InterpolatePointOnCurve = (t: number, curve: Curve) => Point

/**
 * Factory function type that creates an interpolation function for
 * interpolating a point on a curve. curve.
 * @param {Object} config - The configuration object.
 * @param {number} config.precision - The precision level for the interpolation.
 * @returns {InterpolatePointOnCurve} A function that interpolates a point on a
 * curve.
 */
export type InterpolatePointOnCurveFactory = (config: {
  precision: number
}) => InterpolatePointOnCurve

// -----------------------------------------------------------------------------
// Internal
// -----------------------------------------------------------------------------

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
