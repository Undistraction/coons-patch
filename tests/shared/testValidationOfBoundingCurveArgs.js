import { CURVES } from '../const'
import { boundingCurvesValid } from '../fixtures'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

// Reuse tests for correct validations on bounding curves
const testValidationOfBoundingCurveArgs = (functionUnderTest) => {
  describe(`bounding curves`, () => {
    it('should throw if boundingCurves is not an object', () => {
      expect(() => functionUnderTest(null)).toThrow(
        `boundingCurves must be an object, but it was 'null'`
      )
    })
  })

  it(`should throw if the coordinates of top.startPoint and left.startPoint are not the same`, () => {
    const bounds = {
      ...boundingCurvesValid,
      top: {
        ...boundingCurvesValid.top,
        startPoint: { x: -1, y: 0 },
      },
    }
    expect(() => functionUnderTest(bounds)).toThrow(
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
    expect(() => functionUnderTest(bounds)).toThrow(
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
    expect(() => functionUnderTest(bounds)).toThrow(
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
    expect(() => functionUnderTest(bounds)).toThrow(
      `bottom curve endPoint and right curve endPoint must have the same coordinates`
    )
  })

  describe.each(CURVES)(`For '%s' curve validates points`, (curve) => {
    it(`should throw if curve is not an object`, () => {
      const bounds = {
        ...boundingCurvesValid,
        [curve]: 11,
      }
      expect(() => functionUnderTest(bounds)).toThrow(
        `Curve '${curve}' must be an object`
      )
    })

    it('should throw if startPoint is not a valid point', () => {
      const bounds = {
        ...boundingCurvesValid,
        [curve]: { startPoint: 11, endPoint: { x: 0, y: 0 } },
      }
      expect(() => functionUnderTest(bounds)).toThrow(
        `Bounding curve '${curve}' startPoint must be a valid point`
      )
    })

    it('should throw if endPoint is not a valid point', () => {
      const bounds = {
        ...boundingCurvesValid,
        [curve]: { endPoint: 11, startPoint: { x: 0, y: 0 } },
      }
      expect(() => functionUnderTest(bounds)).toThrow(
        `Bounding curve '${curve}' endPoint must be a valid point`
      )
    })
  })
}

// eslint-disable-next-line jest/no-export
export default testValidationOfBoundingCurveArgs
