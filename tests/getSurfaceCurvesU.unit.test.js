import { getSurfaceCurvesU, interpolatePointOnCurveEvenlySpaced } from '../src'
import { boundsValid } from './fixtures'
import testValidationOfBoundingCurveArgs from './shared/testValidationOfBoundingCurveArgs'
import testValidationOfColumnsAndRowsArgs from './shared/testValidationOfColumnsAndRowsArgs'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`getSurfaceCurvesU`, () => {
  describe(`validations`, () => {
    testValidationOfBoundingCurveArgs((boundingCurves) =>
      getSurfaceCurvesU(boundingCurves, 3, 3)
    )
    testValidationOfColumnsAndRowsArgs((...args) =>
      getSurfaceCurvesU(boundsValid, ...args)
    )

    describe(`interpolatePointOnCurve`, () => {
      it(`should throw if interpolatePointOnCurve is not a function`, () => {
        expect(() =>
          getSurfaceCurvesU(boundsValid, 1, 1, {
            interpolatePointOnCurve: 123,
          })
        ).toThrow(`interpolatePointOnCurve must be a function`)
      })
    })

    describe(`interpolateLineU`, () => {
      it(`should throw if interpolateLineU is not a function`, () => {
        expect(() =>
          getSurfaceCurvesU(boundsValid, 1, 1, {
            interpolatePointOnCurve: interpolatePointOnCurveEvenlySpaced,
            interpolateLineU: 123,
          })
        ).toThrow(`interpolateLineU must be a function`)
      })
    })
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() => getSurfaceCurvesU(boundsValid, 1, 1)).not.toThrow()
    })
  })
})
