import { interpolatePointOnCurveLinearFactory } from '../../../src'
import { validateCoonsPatchArguments } from '../../../src/utils/validation'
import { boundingCurvesValid, paramsObjValid } from '../../fixtures'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`validation`, () => {
  describe(`types`, () => {
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
})
