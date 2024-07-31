import { getSurfaceIntersectionPoints } from '../src'
import { boundsValid } from './fixtures'
import testValidationOfBoundingCurveArgs from './shared/testValidationOfBoundingCurveArgs'
import testValidationOfColumnsAndRowsArgs from './shared/testValidationOfColumnsAndRowsArgs'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`getSurfaceIntersectionPoints`, () => {
  describe(`validations`, () => {
    testValidationOfBoundingCurveArgs((boundingCurves) =>
      getSurfaceIntersectionPoints(boundingCurves, 3, 3)
    )
    testValidationOfColumnsAndRowsArgs((...args) =>
      getSurfaceIntersectionPoints(boundsValid, ...args)
    )
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() =>
        getSurfaceIntersectionPoints(boundsValid, 1, 1)
      ).not.toThrow()
    })
  })
})
