import { getSurfaceCurves, interpolatePointOnCurveEvenlySpaced } from '../src'
import { interpolateStraightLineV } from '../src/interpolate/curves/straight'
import fixtures, { boundingCurvesValid } from './fixtures'
import { loadFixtureData } from './helpers'
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
      getSurfaceCurves(boundingCurvesValid, ...args)
    )

    describe(`interpolatePointOnCurve`, () => {
      it(`should throw if interpolatePointOnCurve is not a function`, () => {
        expect(() =>
          getSurfaceCurves(boundingCurvesValid, 1, 1, {
            interpolatePointOnCurve: 123,
          })
        ).toThrow(`interpolatePointOnCurve must be a function`)
      })
    })

    describe(`interpolateLineU`, () => {
      it(`should throw if interpolateLineU is not a function`, () => {
        expect(() =>
          getSurfaceCurves(boundingCurvesValid, 1, 1, {
            interpolatePointOnCurve: interpolatePointOnCurveEvenlySpaced,
            interpolateLineU: 123,
          })
        ).toThrow(`interpolateLineU must be a function`)
      })
    })

    describe(`interpolateLineV`, () => {
      it(`should throw if interpolateLineV is not a function`, () => {
        expect(() =>
          getSurfaceCurves(boundingCurvesValid, 1, 1, {
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
      expect(() => getSurfaceCurves(boundingCurvesValid, 1, 1)).not.toThrow()
    })

    describe.each(fixtures)(`For fixture: '$name'`, ({ name, input }) => {
      let output

      beforeAll(async () => {
        output = await loadFixtureData(name)
      })

      it(`returns the correct data`, () => {
        expect(getSurfaceCurves(...input.api.getSurfaceCurves.args)).toEqual(
          output.curves
        )
      })
    })
  })
})
