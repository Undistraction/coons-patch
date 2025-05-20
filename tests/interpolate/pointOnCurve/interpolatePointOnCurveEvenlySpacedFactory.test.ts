import { interpolatePointOnCurveEvenlySpacedFactory } from '../../../src'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`interpolatePointOnCurveEvenlySpacedFactory`, () => {
  const curve = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 100, y: 0 },
    controlPoint1: { x: 10, y: -10 },
    controlPoint2: { x: 90, y: -10 },
  }

  it(`should return a function`, () => {
    const interpolatePointOnCurve = interpolatePointOnCurveEvenlySpacedFactory()
    expect(interpolatePointOnCurve).toBeInstanceOf(Function)
  })

  describe(`with default precision`, () => {
    const interpolatePointOnCurve = interpolatePointOnCurveEvenlySpacedFactory()
    it(`returns the correct point on the surface`, () => {
      expect(interpolatePointOnCurve(0, curve)).toEqual({
        x: 0,
        y: 0,
      })

      expect(interpolatePointOnCurve(1, curve)).toEqual({
        x: 100,
        y: 0,
      })

      expect(interpolatePointOnCurve(0.25, curve)).toEqual({
        x: 24.4618783125335,
        y: -6.334387794544809,
      })

      expect(interpolatePointOnCurve(0.75, curve)).toEqual({
        x: 75.53812168746649,
        y: -6.33438779454481,
      })
    })
  })

  describe(`with custom precision`, () => {
    const interpolatePointOnCurve = interpolatePointOnCurveEvenlySpacedFactory({
      precision: 10,
    })

    it(`returns the correct point on the surface`, () => {
      expect(interpolatePointOnCurve(0.25, curve)).toEqual({
        x: 24.471119926759947,
        y: -6.335308505609451,
      })
    })
  })
})
