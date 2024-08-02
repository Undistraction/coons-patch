import { getSurfaceIntersectionPoints } from '../src'
import fixtures, { boundingCurvesValid } from './fixtures'
import { loadFixtureData } from './helpers'
import testValidationOfBoundingCurveArgs from './shared/testValidationOfBoundingCurveArgs'
import testValidationOfColumnsAndRowsArgs from './shared/testValidationOfColumnsAndRowsArgs'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`getSurfaceIntersectionPoints`, () => {
  describe(`validations`, () => {
    testValidationOfBoundingCurveArgs((boundingCurves) =>
      getSurfaceIntersectionPoints(boundingCurves, 3, 3)
    )
    testValidationOfColumnsAndRowsArgs((...args) =>
      getSurfaceIntersectionPoints(boundingCurvesValid, ...args)
    )
  })

  describe(`success`, () => {
    it(`doesn't throw with minimal params`, () => {
      expect(() =>
        getSurfaceIntersectionPoints(boundingCurvesValid, 1, 1)
      ).not.toThrow()
    })

    describe.each(fixtures)(`fixture: '$name'`, ({ name, input }) => {
      let output

      beforeAll(async () => {
        output = await loadFixtureData(name)
      })

      it(`returns the correct data`, () => {
        expect(
          getSurfaceIntersectionPoints(
            ...input.api.getSurfaceIntersectionPoints.args
          )
        ).toEqual(output.intersectionPoints)
      })
    })
  })
})
