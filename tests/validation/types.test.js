import { coonsPatch } from '../../src'
import { boundingCurvesValid, paramsObjValid } from '../fixtures'
import { CURVES } from '../const'

// -----------------------------------------------------------------------------
// Tests
// Note: We are testing the validation of input params so we use JS instead of
// typescript.
// -----------------------------------------------------------------------------

describe(`validation`, () => {
  describe(`types`, () => {
    describe(`bounding curves`, () => {
      it(`should throw if boundingCurves is not an object`, () => {
        expect(() => coonsPatch(null, paramsObjValid)).toThrow(
          `boundingCurves must be an object, but it was 'null'`
        )
      })
    })

    describe.each(CURVES)(`for '%s' curve validates points`, (curve) => {
      it(`should throw if curve is not an object`, () => {
        const bounds = {
          ...boundingCurvesValid,
          [curve]: 11,
        }
        expect(() => coonsPatch(bounds, paramsObjValid)).toThrow(
          `Curve '${curve}' must be an object`
        )
      })

      it(`should throw if startPoint is not a valid point`, () => {
        const bounds = {
          ...boundingCurvesValid,
          [curve]: { startPoint: 11, endPoint: { x: 0, y: 0 } },
        }
        expect(() => coonsPatch(bounds, paramsObjValid)).toThrow(
          `Bounding curve '${curve}' startPoint must be a valid point`
        )
      })

      it(`should throw if endPoint is not a valid point`, () => {
        const bounds = {
          ...boundingCurvesValid,
          [curve]: { endPoint: 11, startPoint: { x: 0, y: 0 } },
        }
        expect(() => coonsPatch(bounds, paramsObjValid)).toThrow(
          `Bounding curve '${curve}' endPoint must be a valid point`
        )
      })
    })

    describe(`params object`, () => {
      expect(() => coonsPatch(boundingCurvesValid, `abc`)).toThrow(
        `params must be an object, but it was 'abc'`
      )

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
            coonsPatch(boundingCurvesValid, { ...paramsObjValid, [key]: `abc` })
          ).toThrow(`params.${key} value must be a number, but was 'abc'`)
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
})
