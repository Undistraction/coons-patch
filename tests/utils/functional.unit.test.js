import { describe, expect, it, vi } from 'vitest'
import { mapObj, times, timesReduce } from '../../src/utils/functional'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe('times', () => {
  it('should call the callback n times', () => {
    const callback = vi.fn()
    const n = 5
    times(callback, n)
    expect(callback).toHaveBeenCalledTimes(n)
  })

  it('should pass the correct index to the callback', () => {
    const callback = vi.fn()
    const n = 5
    times(callback, n)
    expect(callback.mock.calls).toEqual([[0], [1], [2], [3], [4]])
  })

  it('should return an array of results from the callback', () => {
    const callback = vi.fn((i) => i * 2)
    const n = 5
    const result = times(callback, n)
    expect(result).toEqual([0, 2, 4, 6, 8])
  })

  it('should return an empty array if n is 0', () => {
    const callback = vi.fn()
    const n = 0
    const result = times(callback, n)
    expect(result).toEqual([])
    expect(callback).not.toHaveBeenCalled()
  })

  it('should return an empty array if n is negative', () => {
    const callback = vi.fn()
    const n = -5
    const result = times(callback, n)
    expect(result).toEqual([])
    expect(callback).not.toHaveBeenCalled()
  })
})

describe('timesReduce', () => {
  it('should call the callback n times and accumulate the result', () => {
    const callback = vi.fn((acc, i) => acc + i)
    const n = 5
    const initialValue = 0
    const result = timesReduce(callback, initialValue, n)
    expect(result).toBe(10)
    expect(callback).toHaveBeenCalledTimes(n)
  })

  it('should pass the correct arguments to the callback', () => {
    const callback = vi.fn((acc, i) => acc + i)
    const n = 3
    const initialValue = 0
    timesReduce(callback, initialValue, n)
    expect(callback).toHaveBeenNthCalledWith(1, 0, 0)
    expect(callback).toHaveBeenNthCalledWith(2, 0, 1)
    expect(callback).toHaveBeenNthCalledWith(3, 1, 2)
  })

  it('should return the initial value if n is 0', () => {
    const callback = vi.fn((acc, i) => acc + i)
    const n = 0
    const initialValue = 10
    const result = timesReduce(callback, initialValue, n)
    expect(result).toBe(initialValue)
    expect(callback).not.toHaveBeenCalled()
  })

  it('should handle negative n gracefully', () => {
    const callback = vi.fn((acc, i) => acc + i)
    const n = -5
    const initialValue = 10
    const result = timesReduce(callback, initialValue, n)
    expect(result).toBe(initialValue)
    expect(callback).not.toHaveBeenCalled()
  })
})

describe('mapObj', () => {
  it('return a new object with its values the result of applying the callback', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = mapObj((value) => value * 2, obj)
    expect(result).toEqual({ a: 2, b: 4, c: 6 })
  })

  it('should pass the key as the second argument to the function', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = mapObj((value, key) => `key is ${key}`, obj)
    expect(result).toEqual({ a: `key is a`, b: `key is b`, c: `key is c` })
  })

  it('should pass the index as the third argument to the function', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = mapObj((value, key, idx) => value + idx, obj)
    expect(result).toEqual({ a: 1, b: 3, c: 5 })
  })

  it('should return an empty object if the input object has no keys', () => {
    const obj = {}
    const result = mapObj((value) => value * 2, obj)
    expect(result).toEqual({})
  })

  it('should not mutate the original object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const originalObj = { ...obj }
    mapObj((value) => value * 2, obj)
    expect(obj).toEqual(originalObj)
  })
})
