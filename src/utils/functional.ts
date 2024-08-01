/* eslint-disable @typescript-eslint/no-explicit-any */
// These are very general-purpose functions, so any is appropriate here.

import { ObjectWithStringKeys } from '../types'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const times = (f: (i: number) => any, n: number): any[] => {
  const result = []
  for (let i = 0; i < n; i++) {
    result.push(f(i))
  }
  return result
}

export const timesReduce = (
  f: (acc: any[], i: number) => any,
  startingValue: any,
  n: number
) => {
  let acc = startingValue
  for (let i = 0; i < n; i++) {
    acc = f(acc, i)
  }
  return acc
}

export const mapObj = (
  f: (value: any, key: string, idx: number) => any,
  o: ObjectWithStringKeys
): ObjectWithStringKeys => {
  return Object.keys(o).reduce((acc, key, idx) => {
    const value = o[key]
    return {
      ...acc,
      [key]: f(value, key, idx),
    }
  }, {})
}
