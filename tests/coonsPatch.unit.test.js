import coonsPatch from '../src'
import fixtures, { boundingCurvesValid } from './fixtures'
import testValidationOfBoundingCurveArgs from './shared/testValidationOfBoundingCurveArgs'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`coonsPatch`, () => {
  describe(`validations`, () => {
    testValidationOfBoundingCurveArgs((boundingCurves) =>
      coonsPatch(boundingCurves, 0, 1)
    )

    describe(`u and v`, () => {
      it(`should throw u is not a number`, () => {
        expect(() => coonsPatch(boundingCurvesValid)).toThrow(
          `u value must be a number, but was 'undefined'`
        )
      })
      it(`should throw if value of u is less than 0`, () => {
        expect(() => coonsPatch(boundingCurvesValid, -1, 0)).toThrow(
          `u value must be between 0 and 1, but was '-1'`
        )
      })
      it(`should throw if value of u is greater than 1`, () => {
        expect(() => coonsPatch(boundingCurvesValid, 2, 0)).toThrow(
          `u value must be between 0 and 1, but was '2'`
        )
      })
      it(`should throw v is not an number`, () => {
        expect(() => coonsPatch(boundingCurvesValid, 0)).toThrow(
          `v value must be a number, but was 'undefined'`
        )
      })
      it(`should throw if value of v is less than 0`, () => {
        expect(() => coonsPatch(boundingCurvesValid, 0, -1)).toThrow(
          `v value must be between 0 and 1, but was '-1'`
        )
      })
      it(`should throw if value of v is greater than 1`, () => {
        expect(() => coonsPatch(boundingCurvesValid, 0, 2)).toThrow(
          `v value must be between 0 and 1, but was '2'`
        )
      })
    })

    describe(`interpolatePointOnCurveU`, () => {
      it(`should throw if interpolatePointOnCurveU is not a function`, () => {
        expect(() =>
          coonsPatch(boundingCurvesValid, 1, 1, {
            interpolatePointOnCurveU: 123,
          })
        ).toThrow(`interpolatePointOnCurveU must be a function`)
      })
    })

    describe(`interpolatePointOnCurveV`, () => {
      it(`should throw if interpolatePointOnCurveV is not a function`, () => {
        expect(() =>
          coonsPatch(boundingCurvesValid, 1, 1, {
            interpolatePointOnCurveV: 123,
          })
        ).toThrow(`interpolatePointOnCurveV must be a function`)
      })
    })
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() => coonsPatch(boundingCurvesValid, 1, 1)).not.toThrow()
    })

    describe(`corner points`, () => {
      it(`returns 0/0 for top-left corner`, () => {
        expect(coonsPatch(boundingCurvesValid, 0, 0)).toEqual({ x: 0, y: 0 })
      })

      it(`returns width/0 for top-right corner`, () => {
        expect(coonsPatch(boundingCurvesValid, 1, 0)).toEqual({
          x: 100,
          y: 0,
        })
      })

      it(`returns width/0 for bottom-left corner`, () => {
        expect(coonsPatch(boundingCurvesValid, 0, 1)).toEqual({
          x: 0,
          y: 100,
        })
      })

      it(`returns width/height for bottom-right corner`, () => {
        expect(coonsPatch(boundingCurvesValid, 1, 1)).toEqual({
          x: 100,
          y: 100,
        })
      })
    })

    describe.each(fixtures)(`fixture: '$name'`, ({ input }) => {
      it(`returns the correct data`, () => {
        expect(coonsPatch(...input.coonsPatch.args)).toMatchSnapshot()
      })
    })
  })
})
