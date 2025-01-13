import { interpolatePointOnCurveLinearFactory } from '../../src'
import {
  validateCoonsPatchArguments,
  validateT,
} from '../../src/utils/validation'
import { boundingCurvesValid, paramsObjValid } from '../fixtures'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`validations`, () => {
  describe(`validateT`, () => {
    it(`shouldn't throw with valid values between 0 and 1`, () => {
      expect(() => validateT(0)).not.toThrow()
      expect(() => validateT(1)).not.toThrow()
      expect(() => validateT(0.5)).not.toThrow()
    })

    it(`should throw with value less than 0`, () => {
      expect(() => validateT(-0.1)).toThrow(
        `t value must be between 0 and 1, but was '-0.1'`
      )
    })

    it(`should throw with value greater than 1`, () => {
      expect(() => validateT(1.1)).toThrow(
        `t value must be between 0 and 1, but was '1.1'`
      )
    })
  })

  describe(`validateCoonsPatchArguments`, () => {
    it(`should not throw with valid arguments`, () => {
      expect(() =>
        validateCoonsPatchArguments(
          boundingCurvesValid,
          paramsObjValid,
          interpolatePointOnCurveLinearFactory(),
          interpolatePointOnCurveLinearFactory(0)
        )
      ).not.toThrow()
    })

    it(`should throw if bounding curves is not an object`, () => {
      expect(() =>
        validateCoonsPatchArguments(
          `abc`,
          paramsObjValid,
          interpolatePointOnCurveLinearFactory(),
          interpolatePointOnCurveLinearFactory(0)
        )
      ).toThrow(`boundingCurves must be an object, but it was 'abc'`)
    })

    describe(`params object`, () => {
      describe.each([
        {
          key: `u`,
        },
        {
          key: `v`,
        },
        {
          key: `uOpposite`,
        },
        {
          key: `vOpposite`,
        },
      ])(`key: $key`, ({ key }) => {
        it(`should throw if ${key} is not a number`, () => {
          expect(() =>
            validateCoonsPatchArguments(
              boundingCurvesValid,
              { ...paramsObjValid, [key]: `abc` },
              interpolatePointOnCurveLinearFactory(),
              interpolatePointOnCurveLinearFactory(0)
            )
          ).toThrow(`params.${key} value must be a number, but was 'abc'`)
        })
      })
    })
  })
})
