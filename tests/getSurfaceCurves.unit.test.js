import { getSurfaceCurves, interpolatePointOnCurveEvenlySpaced } from '../src'
import { interpolateStraightLineOnYAxis } from '../src/interpolate/curves/straight'
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

    describe(`interpolateLineOnXAxis`, () => {
      it(`should throw if interpolateLineOnXAxis is not a function`, () => {
        expect(() =>
          getSurfaceCurves(boundsValid, 1, 1, {
            interpolatePointOnCurve: interpolatePointOnCurveEvenlySpaced,
            interpolateLineOnXAxis: 123,
          })
        ).toThrow(`interpolateLineOnXAxis must be a function`)
      })
    })

    describe(`interpolateLineOnYAxis`, () => {
      it(`should throw if interpolateLineOnYAxis is not a function`, () => {
        expect(() =>
          getSurfaceCurves(boundsValid, 1, 1, {
            interpolatePointOnCurve: interpolatePointOnCurveEvenlySpaced,
            interpolateLineOnXAxis: interpolateStraightLineOnYAxis,
            interpolateLineOnYAxis: 123,
          })
        ).toThrow(`interpolateLineOnYAxis must be a function`)
      })
    })
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() => getSurfaceCurves(boundsValid, 1, 1)).not.toThrow()
    })
  })
})
