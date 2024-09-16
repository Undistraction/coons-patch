import { interpolatePointOnCurveEvenlySpacedFactory } from '../../../src'
import interpolatePointOnSurfaceBilinear from '../../../src/interpolate/pointOnSurface/interpolatePointOnSurfaceBilinear'
import { boundingCurvesValid } from '../../fixtures'

console.log(`>>`, interpolatePointOnSurfaceBilinear)

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`interpolatePointOnCurveBilinear`, () => {
  const interplolatePointOnCurve = interpolatePointOnCurveEvenlySpacedFactory()

  it(`interpolates the correct point on a surface`, () => {
    expect(
      interpolatePointOnSurfaceBilinear(
        boundingCurvesValid,
        0,
        0,
        interplolatePointOnCurve,
        interplolatePointOnCurve
      )
    ).toEqual({
      x: 0,
      y: 0,
    })

    expect(
      interpolatePointOnSurfaceBilinear(
        boundingCurvesValid,
        1,
        1,
        interplolatePointOnCurve,
        interplolatePointOnCurve
      )
    ).toEqual({
      x: 100,
      y: 100,
    })

    expect(
      interpolatePointOnSurfaceBilinear(
        boundingCurvesValid,
        0.25,
        0.75,
        interplolatePointOnCurve,
        interplolatePointOnCurve
      )
    ).toEqual({
      x: 20.334068045517547,
      y: 80.01197449527513,
    })

    expect(
      interpolatePointOnSurfaceBilinear(
        boundingCurvesValid,
        0.75,
        0.5,
        interplolatePointOnCurve,
        interplolatePointOnCurve
      )
    ).toEqual({
      x: 79.82518426378292,
      y: 50.15502250526892,
    })
  })
})
