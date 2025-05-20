import coonsPatch from '../../src'
import { boundingCurvesValid, paramsObjValid } from '../fixtures'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`validation`, () => {
  describe(`behaviour`, () => {
    it(`should throw if the coordinates of top.startPoint and left.startPoint are not the same`, () => {
      const bounds = {
        ...boundingCurvesValid,
        top: {
          ...boundingCurvesValid.top,
          startPoint: { x: -1, y: 0 },
        },
      }
      expect(() => coonsPatch(bounds, paramsObjValid)).toThrow(
        `top curve startPoint and left curve startPoint must have same coordinates`
      )
    })

    it(`should throw if the coordinates of top.endPoint and right.startPoint are not the same`, () => {
      const bounds = {
        ...boundingCurvesValid,
        top: {
          ...boundingCurvesValid.top,
          endPoint: { x: -1, y: 0 },
        },
      }
      expect(() => coonsPatch(bounds, paramsObjValid)).toThrow(
        `top curve endPoint and right curve startPoint must have the same coordinates`
      )
    })

    it(`should throw if the coordinates of bottom.startPoint and left.endPoint are not the same`, () => {
      const bounds = {
        ...boundingCurvesValid,
        bottom: {
          ...boundingCurvesValid.bottom,
          startPoint: { x: -1, y: 0 },
        },
      }
      expect(() => coonsPatch(bounds, paramsObjValid)).toThrow(
        `bottom curve startPoint and left curve endPoint must have the same coordinates`
      )
    })

    it(`should throw if the coordinates of bottom.endPoint and right.endPoint are not the same`, () => {
      const bounds = {
        ...boundingCurvesValid,
        bottom: {
          ...boundingCurvesValid.bottom,
          endPoint: { x: -1, y: 0 },
        },
      }
      expect(() => coonsPatch(bounds, paramsObjValid)).toThrow(
        `bottom curve endPoint and right curve endPoint must have the same coordinates`
      )
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
  })
})
