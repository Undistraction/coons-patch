import { bench, describe } from 'vitest'

import {
  coonsPatch,
  interpolatePointOnCurveEvenlySpacedFactory,
  interpolatePointOnCurveLinearFactory,
} from '../src'
import { boundingCurvesValid } from './fixtures'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

const GRID_SIZE = 99

const interpolateLinear = interpolatePointOnCurveLinearFactory()
const interpolateEvenlySpaced = interpolatePointOnCurveEvenlySpacedFactory()
const interpolateHighPrecision = interpolatePointOnCurveEvenlySpacedFactory({
  precision: 50,
})

// -----------------------------------------------------------------------------
// Benchmarks
// -----------------------------------------------------------------------------

describe(`coonsPatch - single point`, () => {
  bench(`default interpolation`, () => {
    coonsPatch(boundingCurvesValid, { u: 0.5, v: 0.5 })
  })

  bench(`linear interpolation`, () => {
    coonsPatch(
      boundingCurvesValid,
      { u: 0.5, v: 0.5 },
      {
        interpolatePointOnCurveU: interpolateLinear,
        interpolatePointOnCurveV: interpolateLinear,
      }
    )
  })
})

describe(`coonsPatch - ${GRID_SIZE + 1}x${GRID_SIZE + 1} grid`, () => {
  bench(`default interpolation`, () => {
    for (let i = 0; i <= GRID_SIZE; i++) {
      for (let j = 0; j <= GRID_SIZE; j++) {
        coonsPatch(boundingCurvesValid, {
          u: i / GRID_SIZE,
          v: j / GRID_SIZE,
        })
      }
    }
  })

  bench(`linear interpolation`, () => {
    for (let i = 0; i <= GRID_SIZE; i++) {
      for (let j = 0; j <= GRID_SIZE; j++) {
        coonsPatch(
          boundingCurvesValid,
          { u: i / GRID_SIZE, v: j / GRID_SIZE },
          {
            interpolatePointOnCurveU: interpolateLinear,
            interpolatePointOnCurveV: interpolateLinear,
          }
        )
      }
    }
  })

  bench(`high precision`, () => {
    for (let i = 0; i <= GRID_SIZE; i++) {
      for (let j = 0; j <= GRID_SIZE; j++) {
        coonsPatch(
          boundingCurvesValid,
          { u: i / GRID_SIZE, v: j / GRID_SIZE },
          {
            interpolatePointOnCurveU: interpolateHighPrecision,
            interpolatePointOnCurveV: interpolateHighPrecision,
          }
        )
      }
    }
  })
})

describe(`interpolatePointOnCurve`, () => {
  const curve = boundingCurvesValid.top

  bench(`evenly spaced (default precision)`, () => {
    interpolateEvenlySpaced(0.5, curve)
  })

  bench(`evenly spaced (high precision)`, () => {
    interpolateHighPrecision(0.5, curve)
  })

  bench(`linear`, () => {
    interpolateLinear(0.5, curve)
  })
})
