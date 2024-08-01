import { beforeAll, describe, expect, it } from 'vitest'
import {
  getSurfaceCurvesU,
  getSurfaceCurvesV,
  interpolatePointOnCurveEvenlySpaced,
} from '../src'
import fixtures, { boundingCurvesValid } from './fixtures'
import { loadFixtureData } from './helpers'
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
      getSurfaceCurvesV(boundingCurvesValid, ...args)
    )
  })

  describe(`interpolatePointOnCurve`, () => {
    it(`should throw if interpolatePointOnCurve is not a function`, () => {
      expect(() =>
        getSurfaceCurvesV(boundingCurvesValid, 1, 1, {
          interpolatePointOnCurve: 123,
        })
      ).toThrow(`interpolatePointOnCurve must be a function`)
    })
  })

  describe(`interpolateLineV`, () => {
    it(`should throw if interpolateLinesU is not a function`, () => {
      expect(() =>
        getSurfaceCurvesV(boundingCurvesValid, 1, 1, {
          interpolatePointOnCurve: interpolatePointOnCurveEvenlySpaced,
          interpolateLineV: 123,
        })
      ).toThrow(`interpolateLineV must be a function`)
    })
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() => getSurfaceCurvesV(boundingCurvesValid, 1, 1)).not.toThrow()
    })

    describe.each(fixtures)(`fixture: '$name'`, ({ name, input }) => {
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
