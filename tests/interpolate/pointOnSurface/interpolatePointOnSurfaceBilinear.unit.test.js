import { interpolatePointOnCurveEvenlySpacedFactory } from '../../../src'
import interpolatePointOnSurfaceBilinear from '../../../src/interpolate/pointOnSurface/interpolatePointOnSurfaceBilinear'
import { boundingCurvesValid } from '../../fixtures'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`interpolatePointOnCurveBilinear`, () => {
  const interpolatePointOnCurve = interpolatePointOnCurveEvenlySpacedFactory()

  it(`interpolates the correct point on a surface`, () => {
    expect(
      interpolatePointOnSurfaceBilinear(
        boundingCurvesValid,
        {
          u: 0,
          v: 0,
          uOpposite: 0,
          vOpposite: 0,
        },
        interpolatePointOnCurve,
        interpolatePointOnCurve
      )
    ).toEqual({
      x: 0,
      y: 0,
    })

    expect(
      interpolatePointOnSurfaceBilinear(
        boundingCurvesValid,
        {
          u: 1,
          v: 1,
          uOpposite: 1,
          vOpposite: 1,
        },
        interpolatePointOnCurve,
        interpolatePointOnCurve
      )
    ).toEqual({
      x: 100,
      y: 100,
    })

    expect(
      interpolatePointOnSurfaceBilinear(
        boundingCurvesValid,
        {
          u: 0.25,
          v: 0.75,
          uOpposite: 0.25,
          vOpposite: 0.75,
        },
        interpolatePointOnCurve,
        interpolatePointOnCurve
      )
    ).toEqual({
      x: 20.334068045517547,
      y: 80.01197449527513,
    })

    expect(
      interpolatePointOnSurfaceBilinear(
        boundingCurvesValid,
        {
          u: 0.75,
          v: 0.5,
          uOpposite: 0.75,
          vOpposite: 0.5,
        },
        interpolatePointOnCurve,
        interpolatePointOnCurve
      )
    ).toEqual({
      x: 79.82518426378292,
      y: 50.15502250526892,
    })
  })
})
