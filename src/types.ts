// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export enum Coordinate {
  X = 'x',
  Y = 'y',
}

// -----------------------------------------------------------------------------
// Interfaces
// -----------------------------------------------------------------------------

export interface Column extends Step {}
export interface Row extends Step {}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type Point = {
  x: number
  y: number
  t?: number
}

export type Curve = {
  startPoint: Point
  endPoint: Point
  controlPoint1: Point
  controlPoint2: Point
}

export type Points = Point[]

export type BoundingCurves = {
  top: Curve
  bottom: Curve
  left: Curve
  right: Curve
}

export type Step = {
  value: number
  isGutter?: boolean
}

export type UnprocessedStep = number | Step

export type UnprocessedSteps = number | (number | Step)[]

export type ExpandedSteps = (number | Step)[]

export type Steps = Step[]

export type StepCurves = Curve[]

export type UVCurves = {
  u: StepCurves[]
  v: StepCurves[]
}

export type BoundaryPoints = {
  top: Point
  bottom: Point
  left: Point
  right: Point
}

export type CornerPoints = {
  topLeft: Point
  topRight: Point
  bottomLeft: Point
  bottomRight: Point
}

export type InterpolatePointOnCurve = (t: number, curve: Curve) => Point

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

export type GetCoordinateOnSurfaceConfig = {
  coordinateName: Coordinate
  boundaryPoints: BoundaryPoints
  cornerPoints: CornerPoints
  u: number
  v: number
}
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type ObjectWithStringKeys = { [key: string]: any }

// -----------------------------------------------------------------------------
// API-specic
// -----------------------------------------------------------------------------

export type GetSurfacePointConfig = {
  interpolatePointOnCurve?: InterpolatePointOnCurve
}

export type GetSurfaceIntersectionPointsConfig = {
  interpolatePointOnCurve?: InterpolatePointOnCurve
}

export type GetSurfaceCurvesUConfig = {
  interpolatePointOnCurve?: InterpolatePointOnCurve
  interpolateLineU?: InterpolateLineU
}

export type GetSurfaceCurvesVConfig = {
  interpolatePointOnCurve?: InterpolatePointOnCurve
  interpolateLineV?: InterpolateLineV
}

export type GetSurfaceCurvesConfig = {
  interpolatePointOnCurve?: InterpolatePointOnCurve
  interpolateLineU?: InterpolateLineU
  interpolateLineV?: InterpolateLineV
}
