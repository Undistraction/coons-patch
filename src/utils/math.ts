import { Point } from '../types'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const roundToN = (n: number, value: number): number => Number(value.toFixed(n))

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const roundTo10 = (value: number) => roundToN(10, value)
export const roundTo5 = (value: number) => roundToN(5, value)

export const getDistanceBetweenPoints = (
  point1: Point,
  point2: Point
): number => Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2)
