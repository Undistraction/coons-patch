import { interpolatePointOnCurveLinearFactory } from '../../dist'
import {
  validateCoonsPatchArguments,
  validateT,
} from '../../src/utils/validation'
import { boundingCurvesValid } from '../fixtures'

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
          0.5,
          1,
          interpolatePointOnCurveLinearFactory(),
          interpolatePointOnCurveLinearFactory(0)
        )
      ).not.toThrow()
    })

    it(`should throw if bounding curves is not an object`, () => {
      expect(() =>
        validateCoonsPatchArguments(
          `abc`,
          0.5,
          1.1,
          interpolatePointOnCurveLinearFactory(),
          interpolatePointOnCurveLinearFactory(0)
        )
      ).toThrow(`boundingCurves must be an object, but it was 'abc'`)
    })

    it(`should throw if u is not a number`, () => {
      expect(() =>
        validateCoonsPatchArguments(
          boundingCurvesValid,
          `abc`,
          1,
          interpolatePointOnCurveLinearFactory(),
          interpolatePointOnCurveLinearFactory(0)
        )
      ).toThrow(`u value must be a number, but was 'abc'`)
    })

    it(`should throw if v is not a number`, () => {
      expect(() =>
        validateCoonsPatchArguments(
          boundingCurvesValid,
          1,
          `abc`,
          interpolatePointOnCurveLinearFactory(),
          interpolatePointOnCurveLinearFactory(0)
        )
      ).toThrow(`v value must be a number, but was 'abc'`)
    })

    it(`should throw if u is less than zero`, () => {
      expect(() =>
        validateCoonsPatchArguments(
          boundingCurvesValid,
          -0.1,
          0.5,
          interpolatePointOnCurveLinearFactory(),
          interpolatePointOnCurveLinearFactory(0)
        )
      ).toThrow(`u value must be between 0 and 1, but was '-0.1'`)
    })

    it(`should throw if u is greater than 1`, () => {
      expect(() =>
        validateCoonsPatchArguments(
          boundingCurvesValid,
          1.1,
          0.5,
          interpolatePointOnCurveLinearFactory(),
          interpolatePointOnCurveLinearFactory(0)
        )
      ).toThrow(`u value must be between 0 and 1, but was '1.1'`)
    })

    it(`should throw if v is less than zero`, () => {
      expect(() =>
        validateCoonsPatchArguments(
          boundingCurvesValid,
          0.5,
          -0.1,
          interpolatePointOnCurveLinearFactory(),
          interpolatePointOnCurveLinearFactory(0)
        )
      ).toThrow(`v value must be between 0 and 1, but was '-0.1'`)
    })

    it(`should throw if v is greater than 1`, () => {
      expect(() =>
        validateCoonsPatchArguments(
          boundingCurvesValid,
          0.5,
          1.1,
          interpolatePointOnCurveLinearFactory(),
          interpolatePointOnCurveLinearFactory(0)
        )
      ).toThrow(`v value must be between 0 and 1, but was '1.1'`)
    })
  })
})
