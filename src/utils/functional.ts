/* eslint-disable @typescript-eslint/no-explicit-any */
// These are very general-purpose functions, so any is appropriate here.

import { ObjectWithStringKeys } from '../types'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

// Each item in the return array will be same type as the return value of f (T)
export const times = <T>(f: (i: number) => T, n: number): T[] => {
  const result = []
  for (let i = 0; i < n; i++) {
    result.push(f(i))
  }
  return result
}

// The reduced value will be same type as the return value of f (T)
export const timesReduce = <T>(
  f: (acc: any[], i: number) => T,
  startingValue: any,
  n: number
): T => {
  let acc = startingValue
  for (let i = 0; i < n; i++) {
    acc = f(acc, i)
  }
  return acc
}

// The values of each object key will be the same as the return vlaue of f (T)
export const mapObj = <T>(
  f: (value: any, key: string, idx: number) => T,
  o: ObjectWithStringKeys
): { [key: string]: T } => {
  return Object.keys(o).reduce((acc, key, idx) => {
    const value = o[key]
    return {
      ...acc,
      [key]: f(value, key, idx),
    }
  }, {})
}
