import {
  getSurfaceCurvesYAxis,
  interpolatePointOnCurveEvenlySpaced,
} from '../src'
import { boundsValid } from './fixtures'
import testValidationOfBoundingCurveArgs from './shared/testValidationOfBoundingCurveArgs'
import testValidationOfColumnsAndRowsArgs from './shared/testValidationOfColumnsAndRowsArgs'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`getSurfaceCurvesYAxis`, () => {
  describe(`validations`, () => {
    testValidationOfBoundingCurveArgs((boundingCurves) =>
      getSurfaceCurvesYAxis(boundingCurves, 3, 3)
    )
    testValidationOfColumnsAndRowsArgs((...args) =>
      getSurfaceCurvesYAxis(boundsValid, ...args)
    )
  })

  describe(`interpolatePointOnCurve`, () => {
    it(`should throw if interpolatePointOnCurve is not a function`, () => {
      expect(() =>
        getSurfaceCurvesYAxis(boundsValid, 1, 1, {
          interpolatePointOnCurve: 123,
        })
      ).toThrow(`interpolatePointOnCurve must be a function`)
    })
  })

  describe(`interpolateLineOnYAxis`, () => {
    it(`should throw if interpolateLinesU is not a function`, () => {
      expect(() =>
        getSurfaceCurvesYAxis(boundsValid, 1, 1, {
          interpolatePointOnCurve: interpolatePointOnCurveEvenlySpaced,
          interpolateLineOnYAxis: 123,
        })
      ).toThrow(`interpolateLineOnYAxis must be a function`)
    })
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() => getSurfaceCurvesYAxis(boundsValid, 1, 1)).not.toThrow()
    })
  })
})
