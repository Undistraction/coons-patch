import { getSurfaceCurvesV, interpolatePointOnCurveEvenlySpaced } from '../src'
import { boundsValid } from './fixtures'
import testValidationOfBoundingCurveArgs from './shared/testValidationOfBoundingCurveArgs'
import testValidationOfColumnsAndRowsArgs from './shared/testValidationOfColumnsAndRowsArgs'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`getSurfaceCurvesV`, () => {
  describe(`validations`, () => {
    testValidationOfBoundingCurveArgs((boundingCurves) =>
      getSurfaceCurvesV(boundingCurves, 3, 3)
    )
    testValidationOfColumnsAndRowsArgs((...args) =>
      getSurfaceCurvesV(boundsValid, ...args)
    )
  })

  describe(`interpolatePointOnCurve`, () => {
    it(`should throw if interpolatePointOnCurve is not a function`, () => {
      expect(() =>
        getSurfaceCurvesV(boundsValid, 1, 1, {
          interpolatePointOnCurve: 123,
        })
      ).toThrow(`interpolatePointOnCurve must be a function`)
    })
  })

  describe(`interpolateLineV`, () => {
    it(`should throw if interpolateLinesU is not a function`, () => {
      expect(() =>
        getSurfaceCurvesV(boundsValid, 1, 1, {
          interpolatePointOnCurve: interpolatePointOnCurveEvenlySpaced,
          interpolateLineV: 123,
        })
      ).toThrow(`interpolateLineV must be a function`)
    })
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() => getSurfaceCurvesV(boundsValid, 1, 1)).not.toThrow()
    })
  })
})
