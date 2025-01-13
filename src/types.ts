// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export enum Coordinate {
  X = `x`,
  Y = `y`,
}

// -----------------------------------------------------------------------------
// Interfaces
// -----------------------------------------------------------------------------

export interface Point {
  x: number
  y: number
}

export interface Curve {
  startPoint: Point
  endPoint: Point
  controlPoint1: Point
  controlPoint2: Point
}

export interface BoundingCurves {
  top: Curve
  bottom: Curve
  left: Curve
  right: Curve
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

// -----------------------------------------------------------------------------
// Interfaces: Function args
// -----------------------------------------------------------------------------

export interface GetCoordinateOnSurfaceConfig {
  coordinateName: Coordinate
  boundaryPoints: BoundaryPoints
  cornerPoints: CornerPoints
  params: InterpolationParametersRequired
}

export interface InterpolationParametersSimple {
  u: number // u parameter along top edge
  v: number // v parameter along left edge
}

export interface InterpolationParameters extends InterpolationParametersSimple {
  uOpposite?: number // u parameter along bottom edge
  vOpposite?: number // v parameter along right edge
}

export type InterpolationParametersRequired = Required<InterpolationParameters>

// -----------------------------------------------------------------------------
// Interfaces: API-specific
// -----------------------------------------------------------------------------

export interface CoonsPatchConfig {
  interpolatePointOnCurveU?: InterpolatePointOnCurve
  interpolatePointOnCurveV?: InterpolatePointOnCurve
}

// -----------------------------------------------------------------------------
// Types: Generic
// -----------------------------------------------------------------------------

export type Points = Point[]

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type ObjectWithStringKeys = Record<string, any>

// -----------------------------------------------------------------------------
// Types: Function signatures
// -----------------------------------------------------------------------------

export type InterpolatePointOnCurve = (t: number, curve: Curve) => Point

export type InterpolatePointOnCurveFactory = (config: {
  precision: number
}) => InterpolatePointOnCurve
