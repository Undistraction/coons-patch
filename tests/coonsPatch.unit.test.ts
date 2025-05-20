import { coonsPatch } from '../src'
import fixtures from './fixtures'
import { paramsObjValid, boundingCurvesValid } from './fixtures'
import { Fixture } from './types'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`coonsPatch`, () => {
  describe.each(fixtures)(`fixture: '$name'`, (fixture: Fixture) => {
    it(`returns the correct data`, () => {
      expect(coonsPatch(...fixture.input.coonsPatch.args)).toMatchSnapshot()
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
  })
})
