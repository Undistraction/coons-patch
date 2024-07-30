import { getSurfacePoint } from '../src'
import { boundsValid } from './fixtures'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`getSurfacePoint`, () => {
  describe(`invalid arguments`, () => {
    it('should throw of value of u is less than 0', () => {
      expect(() => getSurfacePoint(boundsValid, -1, 0)).toThrow(
        `u value must be between 0 and 1, but was '-1'`
      )
    })
    it('should throw of value of u is greater than 1', () => {
      expect(() => getSurfacePoint(boundsValid, 2, 0)).toThrow(
        `u value must be between 0 and 1, but was '2'`
      )
    })

    it('should throw of value of v is less than 0', () => {
      expect(() => getSurfacePoint(boundsValid, 0, -1)).toThrow(
        `v value must be between 0 and 1, but was '-1'`
      )
    })
    it('should throw of value of v is greater than 1', () => {
      expect(() => getSurfacePoint(boundsValid, 0, 2)).toThrow(
        `v value must be between 0 and 1, but was '2'`
      )
    })
  })
})
