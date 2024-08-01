import { beforeAll, describe, expect, it } from 'vitest'
import { getSurfaceCurvesU, interpolatePointOnCurveEvenlySpaced } from '../src'
import fixtures, { boundingCurvesValid } from './fixtures'
import { loadFixtureData } from './helpers'
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
      getSurfaceCurvesU(boundingCurvesValid, ...args)
    )

    describe(`interpolatePointOnCurve`, () => {
      it(`should throw if interpolatePointOnCurve is not a function`, () => {
        expect(() =>
          getSurfaceCurvesU(boundingCurvesValid, 1, 1, {
            interpolatePointOnCurve: 123,
          })
        ).toThrow(`interpolatePointOnCurve must be a function`)
      })
    })

    describe(`interpolateLineU`, () => {
      it(`should throw if interpolateLineU is not a function`, () => {
        expect(() =>
          getSurfaceCurvesU(boundingCurvesValid, 1, 1, {
            interpolatePointOnCurve: interpolatePointOnCurveEvenlySpaced,
            interpolateLineU: 123,
          })
        ).toThrow(`interpolateLineU must be a function`)
      })
    })
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() => getSurfaceCurvesU(boundingCurvesValid, 1, 1)).not.toThrow()
    })

    describe.each(fixtures)(`For fixture: '$name'`, ({ name, input }) => {
      let output

      beforeAll(async () => {
        output = await loadFixtureData(name)
      })

      it(`returns the correct data`, () => {
        expect(getSurfaceCurvesU(...input.api.getSurfaceCurvesU.args)).toEqual(
          output.curvesU
        )
      })
    })
  })
})
