import { interpolatePointOnCurveLinearFactory } from '../src'
import {
  BoundingCurves,
  CoonsPatchConfig,
  InterpolationParameters,
} from '../src/types'
import { Fixture } from './types'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type CoonsPatchArgs = [
  BoundingCurves,
  InterpolationParameters,
  CoonsPatchConfig?,
]

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

export const boundingCurvesValid = {
  top: {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 100, y: 0 },
    controlPoint1: { x: 10, y: -10 },
    controlPoint2: { x: 90, y: -10 },
  },
  bottom: {
    startPoint: { x: 0, y: 100 },
    endPoint: { x: 100, y: 100 },
    controlPoint1: { x: -10, y: 110 },
    controlPoint2: { x: 110, y: 110 },
  },
  left: {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 100 },
    controlPoint1: { x: -10, y: -10 },
    controlPoint2: { x: -10, y: 110 },
  },
  right: {
    startPoint: { x: 100, y: 0 },
    endPoint: { x: 100, y: 100 },
    controlPoint1: { x: 110, y: -10 },
    controlPoint2: { x: 110, y: 110 },
  },
}

export const paramsObjValid = {
  u: 0,
  v: 1,
  uOpposite: 0,
  vOpposite: 1,
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

// Define different sets of params to test
// Save the results to JSON files to import into tests
// Set 'skipSnapshot: false' for each item to skip the snapshot
const fixtures: Fixture[] = [
  {
    name: `Arbitrary point`,
    skipTest: false,
    input: {
      coonsPatch: {
        args: [boundingCurvesValid, { u: 0.25, v: 0.5 }] as [
          BoundingCurves,
          InterpolationParameters,
        ],
      },
    },
  },
  {
    name: `Arbitrary point with linear interpolatePointOnCurve`,
    skipTest: false,
    input: {
      coonsPatch: {
        args: [
          boundingCurvesValid,
          { u: 0.25, v: 0.5 },
          {
            interpolatePointOnCurveU: interpolatePointOnCurveLinearFactory(),
            interpolatePointOnCurveV: interpolatePointOnCurveLinearFactory(),
          },
        ] as CoonsPatchArgs,
      },
    },
  },
  {
    name: `Arbitrary point with different interpolations for each axis`,
    skipTest: false,
    input: {
      coonsPatch: {
        args: [
          boundingCurvesValid,
          { u: 0.25, v: 0.5 },
          {
            interpolatePointOnCurveU: interpolatePointOnCurveLinearFactory(),
          },
        ] as CoonsPatchArgs,
      },
    },
  },
].filter(({ skipTest }) => skipTest !== true)

export default fixtures
