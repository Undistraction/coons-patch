import { getSurfacePoint } from '../src'
import { boundsValid } from './fixtures'
import testValidationOfBoundingCurveArgs from './shared/testValidationOfBoundingCurveArgs'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`getSurfacePoint`, () => {
  describe(`validations`, () => {
    testValidationOfBoundingCurveArgs((boundingCurves) =>
      getSurfacePoint(boundingCurves, 0, 1)
    )

    describe(`u and v`, () => {
      it('should throw u is not a number', () => {
        expect(() => getSurfacePoint(boundsValid)).toThrow(
          `u value must be a number, but was 'undefined'`
        )
      })
      it('should throw if value of u is less than 0', () => {
        expect(() => getSurfacePoint(boundsValid, -1, 0)).toThrow(
          `u value must be between 0 and 1, but was '-1'`
        )
      })
      it('should throw if value of u is greater than 1', () => {
        expect(() => getSurfacePoint(boundsValid, 2, 0)).toThrow(
          `u value must be between 0 and 1, but was '2'`
        )
      })
      it('should throw v is not an number', () => {
        expect(() => getSurfacePoint(boundsValid, 0)).toThrow(
          `v value must be a number, but was 'undefined'`
        )
      })
      it('should throw if value of v is less than 0', () => {
        expect(() => getSurfacePoint(boundsValid, 0, -1)).toThrow(
          `v value must be between 0 and 1, but was '-1'`
        )
      })
      it('should throw if value of v is greater than 1', () => {
        expect(() => getSurfacePoint(boundsValid, 0, 2)).toThrow(
          `v value must be between 0 and 1, but was '2'`
        )
      })
    })

    describe(`interpolatePointOnCurve`, () => {
      it(`should throw if interpolatePointOnCurve is not a function`, () => {
        expect(() =>
          getSurfacePoint(boundsValid, 1, 1, { interpolatePointOnCurve: 123 })
        ).toThrow(`interpolatePointOnCurve must be a function`)
      })
    })
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() => getSurfacePoint(boundsValid, 1, 1)).not.toThrow()
    })
  })
})
