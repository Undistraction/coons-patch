import coonsPatch from '../src'
import fixtures, { boundingCurvesValid, paramsObjValid } from './fixtures'
import testValidationOfBoundingCurveArgs from './shared/testValidationOfBoundingCurveArgs'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe.skip(`coonsPatch`, () => {
  describe(`validations`, () => {
    testValidationOfBoundingCurveArgs((boundingCurves) =>
      coonsPatch(boundingCurves, 0, 1)
    )

    describe(`params object`, () => {
      describe.each([
        {
          key: `u`,
        },
        {
          key: `v`,
        },
      ])(`key: $key`, ({ key }) => {
        it(`should throw if ${key} is not a number`, () => {
          expect(() =>
            coonsPatch(boundingCurvesValid, { ...paramsObjValid, [key]: `abc` })
          ).toThrow(`params.${key} value must be a number, but was 'abc'`)
        })

        it(`should throw if ${key} is less than zero`, () => {
          expect(() =>
            coonsPatch(boundingCurvesValid, { ...paramsObjValid, [key]: -0.1 })
          ).toThrow(
            `params.${key} value must be between 0 and 1, but was '-0.1'`
          )
        })

        it(`should throw if ${key} is greater than 1`, () => {
          expect(() =>
            coonsPatch(boundingCurvesValid, { ...paramsObjValid, [key]: 1.1 })
          ).toThrow(
            `params.${key} value must be between 0 and 1, but was '1.1'`
          )
        })
      })
    })

    describe(`interpolatePointOnCurveU`, () => {
      it(`should throw if interpolatePointOnCurveU is not a function`, () => {
        expect(() =>
          coonsPatch(boundingCurvesValid, paramsObjValid, {
            interpolatePointOnCurveU: 123,
          })
        ).toThrow(`interpolatePointOnCurveU must be a function`)
      })
    })

    describe(`interpolatePointOnCurveV`, () => {
      it(`should throw if interpolatePointOnCurveV is not a function`, () => {
        expect(() =>
          coonsPatch(boundingCurvesValid, paramsObjValid, {
            interpolatePointOnCurveV: 123,
          })
        ).toThrow(`interpolatePointOnCurveV must be a function`)
      })
    })
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() =>
        coonsPatch(boundingCurvesValid, paramsObjValid)
      ).not.toThrow()
    })

    describe(`corner points`, () => {
      it(`returns 0/0 for top-left corner`, () => {
        expect(coonsPatch(boundingCurvesValid, { u: 0, v: 0 })).toEqual({
          x: 0,
          y: 0,
        })
      })

      it(`returns width/0 for top-right corner`, () => {
        expect(coonsPatch(boundingCurvesValid, { u: 1, v: 0 })).toEqual({
          x: 100,
          y: 0,
        })
      })

      it(`returns width/0 for bottom-left corner`, () => {
        expect(coonsPatch(boundingCurvesValid, { u: 0, v: 1 })).toEqual({
          x: 0,
          y: 100,
        })
      })

      it(`returns width/height for bottom-right corner`, () => {
        expect(coonsPatch(boundingCurvesValid, { u: 1, v: 1 })).toEqual({
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
