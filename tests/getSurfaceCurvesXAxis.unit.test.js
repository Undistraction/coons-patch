import {
  getSurfaceCurvesXAxis,
  interpolatePointOnCurveEvenlySpaced,
} from '../src'
import { boundsValid } from './fixtures'
import testValidationOfBoundingCurveArgs from './shared/testValidationOfBoundingCurveArgs'
import testValidationOfColumnsAndRowsArgs from './shared/testValidationOfColumnsAndRowsArgs'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`getSurfaceCurvesXAxis`, () => {
  describe(`validations`, () => {
    testValidationOfBoundingCurveArgs((boundingCurves) =>
      getSurfaceCurvesXAxis(boundingCurves, 3, 3)
    )
    testValidationOfColumnsAndRowsArgs((...args) =>
      getSurfaceCurvesXAxis(boundsValid, ...args)
    )

    describe(`interpolatePointOnCurve`, () => {
      it(`should throw if interpolatePointOnCurve is not a function`, () => {
        expect(() =>
          getSurfaceCurvesXAxis(boundsValid, 1, 1, {
            interpolatePointOnCurve: 123,
          })
        ).toThrow(`interpolatePointOnCurve must be a function`)
      })
    })

    describe(`interpolateLineOnXAxis`, () => {
      it(`should throw if interpolateLineOnXAxis is not a function`, () => {
        expect(() =>
          getSurfaceCurvesXAxis(boundsValid, 1, 1, {
            interpolatePointOnCurve: interpolatePointOnCurveEvenlySpaced,
            interpolateLineOnXAxis: 123,
          })
        ).toThrow(`interpolateLineOnXAxis must be a function`)
      })
    })
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() => getSurfaceCurvesXAxis(boundsValid, 1, 1)).not.toThrow()
    })
  })
})
