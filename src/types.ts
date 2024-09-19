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
  [key: string]: Curve
}

export interface BoundaryPoints {
  [key: string]: Point
}

export interface CornerPoints {
  [key: string]: Point
}

// -----------------------------------------------------------------------------
// Interfaces: Function args
// -----------------------------------------------------------------------------

export interface GetCoordinateOnSurfaceConfig {
  coordinateName: Coordinate
  boundaryPoints: BoundaryPoints
  cornerPoints: CornerPoints
  u: number
  v: number
}

// -----------------------------------------------------------------------------
// Interfaces: API-specic
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
export type ObjectWithStringKeys = { [key: string]: any }

// -----------------------------------------------------------------------------
// Types: Function signatures
// -----------------------------------------------------------------------------

export type InterpolatePointOnCurve = (t: number, curve: Curve) => Point

export type InterpolatePointOnCurveFactory = (config: {
  precision: number
}) => InterpolatePointOnCurve
