import { interpolatePointOnCurveLinearFactory } from '../../../src'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`interpolatePointOnCurveLinearFactory`, () => {
  const interplolatePointOnCurve = interpolatePointOnCurveLinearFactory()

  const curve = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 100, y: 0 },
    controlPoint1: { x: 10, y: -10 },
    controlPoint2: { x: 90, y: -10 },
  }

  it(`should return a function`, () => {
    expect(interplolatePointOnCurve).toBeInstanceOf(Function)
  })

  it(`should return the correct point on a curve`, () => {
    expect(interplolatePointOnCurve(0, curve)).toEqual({
      x: 0,
      y: 0,
    })

    expect(interplolatePointOnCurve(1, curve)).toEqual({
      x: 100,
      y: 0,
    })

    expect(interplolatePointOnCurve(0.25, curve)).toEqual({
      x: 18.4375,
      y: -5.625,
    })

    expect(interplolatePointOnCurve(0.75, curve)).toEqual({
      x: 81.5625,
      y: -5.625,
    })
  })
})
