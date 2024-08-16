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
// Set 'skipSnapshot' falsetrue' for each item to skip the snapshot
const allFixtures = [
  {
    name: `1x1 grid`,
    skipSnapshot: true,
    skipTest: false,
    input: {
      getSurfacePoint: {
        args: [boundingCurvesValid, 0.25, 0.5],
      },
      getSurfaceIntersectionPoints: {
        args: [boundingCurvesValid, 0, 0],
      },
      getSurfaceCurvesU: {
        args: [boundingCurvesValid, 0, 0],
      },
      getSurfaceCurvesV: {
        args: [boundingCurvesValid, 0, 0],
      },
      getSurfaceCurves: {
        args: [boundingCurvesValid, 0, 0],
      },
    },
  },
  {
    name: `3x3 grid`,
    skipSnapshot: true,
    skipTest: false,
    input: {
      getSurfacePoint: {
        args: [boundingCurvesValid, 0.25, 0.5],
      },
      getSurfaceIntersectionPoints: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurvesU: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurvesV: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurves: {
        args: [boundingCurvesValid, 4, 3],
      },
    },
  },
  {
    name: `3x3 grid with linear interpolationStrategy`,
    skipSnapshot: true,
    skipTest: false,
    input: {
      getSurfacePoint: {
        args: [boundingCurvesValid, 0.25, 0.5],
      },
      getSurfaceIntersectionPoints: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurvesU: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurvesV: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurves: {
        args: [boundingCurvesValid, 4, 3],
      },
    },
  },
  {
    name: `3x3 grid with curves lineStrategy`,
    skipSnapshot: true,
    skipTest: false,
    input: {
      getSurfacePoint: {
        args: [boundingCurvesValid, 0.25, 0.5],
      },
      getSurfaceIntersectionPoints: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurvesU: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurvesV: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurves: {
        args: [boundingCurvesValid, 4, 3],
      },
    },
  },
  {
    name: `Grid with custom columns and rows via array of numbers`,
    skipSnapshot: true,
    skipTest: false,
    input: {
      getSurfacePoint: {
        args: [boundingCurvesValid, 0.25, 0.5],
      },
      getSurfaceIntersectionPoints: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurvesU: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurvesV: {
        args: [boundingCurvesValid, 4, 3],
      },
      getSurfaceCurves: {
        args: [boundingCurvesValid, 4, 3],
      },
    },
  },
  {
    name: `Grid with custom columns and rows via array of objects`,
    skipSnapshot: false,
    skipTest: false,
    input: {
      getSurfacePoint: {
        args: [boundingCurvesValid, 0.25, 0.5],
      },
      getSurfaceIntersectionPoints: {
        args: [boundingCurvesValid, 1, 2],
      },
      getSurfaceCurvesU: {
        args: [boundingCurvesValid, 1, 2],
      },
      getSurfaceCurvesV: {
        args: [boundingCurvesValid, 1, 2],
      },
      getSurfaceCurves: {
        args: [boundingCurvesValid, 1, 2],
      },
    },
  },
]

const fixtures = allFixtures.filter(({ skipTest }) => skipTest !== true)

export default fixtures
