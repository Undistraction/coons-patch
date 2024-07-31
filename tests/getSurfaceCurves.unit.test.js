import { getSurfaceCurves, interpolatePointOnCurveEvenlySpaced } from '../src'
import { interpolateStraightLineV } from '../src/interpolate/curves/straight'
import { boundsValid } from './fixtures'
import testValidationOfBoundingCurveArgs from './shared/testValidationOfBoundingCurveArgs'
import testValidationOfColumnsAndRowsArgs from './shared/testValidationOfColumnsAndRowsArgs'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`getSurfaceCurves`, () => {
  describe(`validations`, () => {
    testValidationOfBoundingCurveArgs((boundingCurves) =>
      getSurfaceCurves(boundingCurves, 3, 3)
    )
    testValidationOfColumnsAndRowsArgs((...args) =>
      getSurfaceCurves(boundsValid, ...args)
    )

    describe(`interpolatePointOnCurve`, () => {
      it(`should throw if interpolatePointOnCurve is not a function`, () => {
        expect(() =>
          getSurfaceCurves(boundsValid, 1, 1, { interpolatePointOnCurve: 123 })
        ).toThrow(`interpolatePointOnCurve must be a function`)
      })
    })

    describe(`interpolateLineU`, () => {
      it(`should throw if interpolateLineU is not a function`, () => {
        expect(() =>
          getSurfaceCurves(boundsValid, 1, 1, {
            interpolatePointOnCurve: interpolatePointOnCurveEvenlySpaced,
            interpolateLineU: 123,
          })
        ).toThrow(`interpolateLineU must be a function`)
      })
    })

    describe(`interpolateLineV`, () => {
      it(`should throw if interpolateLineV is not a function`, () => {
        expect(() =>
          getSurfaceCurves(boundsValid, 1, 1, {
            interpolatePointOnCurve: interpolatePointOnCurveEvenlySpaced,
            interpolateLineU: interpolateStraightLineV,
            interpolateLineV: 123,
          })
        ).toThrow(`interpolateLineV must be a function`)
      })
    })
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() => getSurfaceCurves(boundsValid, 1, 1)).not.toThrow()
    })
  })
})
