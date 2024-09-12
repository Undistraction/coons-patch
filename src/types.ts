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

export interface Column extends Step {}

export interface Row extends Step {}

export interface Point {
  x: number
  y: number
  t?: number
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

export interface Step {
  value: number
  isGutter?: boolean
}

export interface UVCurves {
  u: StepCurves[]
  v: StepCurves[]
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

export interface GetSurfaceIntersectionPointsConfig {
  interpolatePointOnCurve?: InterpolatePointOnCurve
}

export interface GetSurfaceCurvesUConfig {
  interpolatePointOnCurve?: InterpolatePointOnCurve
  interpolateLineU?: InterpolateLineU
}

export interface GetSurfaceCurvesVConfig {
  interpolatePointOnCurve?: InterpolatePointOnCurve
  interpolateLineV?: InterpolateLineV
}

export interface GetSurfaceCurvesConfig {
  interpolatePointOnCurve?: InterpolatePointOnCurve
  interpolateLineU?: InterpolateLineU
  interpolateLineV?: InterpolateLineV
}

// -----------------------------------------------------------------------------
// Types: Generic
// -----------------------------------------------------------------------------

export type Points = Point[]

export type UnprocessedStep = number | Step

export type UnprocessedSteps = number | (number | Step)[]

export type ExpandedSteps = (number | Step)[]

export type Steps = Step[]

export type StepCurves = Curve[]

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type ObjectWithStringKeys = { [key: string]: any }

// -----------------------------------------------------------------------------
// Types: Function signatures
// -----------------------------------------------------------------------------

export type InterpolatePointOnCurve = (t: number, curve: Curve) => Point

export type InterpolatePointOnCurveFactory = (config: {
  precision: number
}) => InterpolatePointOnCurve

export type InterpolateLineU = (
  boundingCurves: BoundingCurves,
  vStart: number,
  vSize: number,
  vEnd: number,
  uStart: number,
  interpolatePointOnCurve: InterpolatePointOnCurve
) => Curve

export type InterpolateLineV = (
  boundingCurves: BoundingCurves,
  uStart: number,
  uSize: number,
  uEnd: number,
  vStart: number,
  interpolatePointOnCurve: InterpolatePointOnCurve
) => Curve
