import { interpolatePointOnCurveLinearFactory } from '../dist/index.js'

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

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

// Define different sets of params to test
// Save the results to JSON files to import into tests
// Set 'skipSnapshot: false' for each item to skip the snapshot
const fixtures = [
  {
    name: `Arbitrary point`,
    skipSnapshot: true,
    skipTest: false,
    input: {
      coonsPatch: {
        args: [boundingCurvesValid, 0.25, 0.5],
      },
    },
  },
  {
    name: `Arbitrary point with linear interpolatePointOnCurve`,
    skipSnapshot: true,
    skipTest: false,
    input: {
      coonsPatch: {
        args: [
          boundingCurvesValid,
          0.25,
          0.5,
          {
            interpolatePointOnCurveU: interpolatePointOnCurveLinearFactory(),
            interpolatePointOnCurveV: interpolatePointOnCurveLinearFactory(),
          },
        ],
      },
    },
  },
  {
    name: `Arbitrary point with different interpolations for each axis`,
    skipSnapshot: false,
    skipTest: false,
    input: {
      coonsPatch: {
        args: [
          boundingCurvesValid,
          0.25,
          0.5,
          {
            interpolatePointOnCurveU: interpolatePointOnCurveLinearFactory(),
          },
        ],
      },
    },
  },
].filter(({ skipTest }) => skipTest !== true)

export default fixtures
