# README

A [Coons patch](https://en.wikipedia.org/wiki/Coons_patch) is a kind of four-sided surface defined by four straight or curved edges, and this package provides a small API for creating a coons-patch and finding a point on that surface.

This package is used by [warp-grid](https://github.com/Undistraction/warp-grid) which supplies a greatly extended API build on-top of this package for modeling complex warped grids.

To visualise and play with a coons patch as used in the warp-grid, please see its interactive demo [here](https://warp-grid-editor.undistraction.com/).

[Documenation](https://coons-patch-docs.undistraction.com).

This package is written in TypeScript and exports its types.

## Install package

```bash
npm add coons-patch
# or
yarn add coons-patch
# or
pnpm add coons-patch
```

## Quick-start

```typeScript
import coonsPatch from 'coons-patch'

// Define bounding curves for the patch
const boundingCurves = {
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

const point = coonsPatch(boundingCurves, 0.1, 0.6)
```

To generate a patch you must provide a set of four **bounding curves** (`top`, `left`, `bottom` and `right`) in the form of four cubic Bezier curves. A cubic Bezier curve describes a straight-line or curve using a start point (`startPoint`), an end point (`endPoint`) and two other control points(`controlPoint1` and `controlPoint2`). Each point has an `x` and `y` coordinate.

At minimum you must supply start and end points for each curve. If you do not supply `controlPoint1` it will be set to the same cooridinates as the start point, and if you do not supply `controlPoint2` it will be set to the same coordindates as the end point. Setting both control points to the same values as the start and end point will result in a straight line.

You also need to ensure that the four curves meet at the corners. You will probably be expecting the end of each curve to be the start of the next, however in keeping with the math involved in generating a coons-patch this is not the case. The `top` and `bottom` curves run left to right, and `left` and `right` curves run top to bottom, so the `startPoint` of the `top` curve must share the same coordinates with the `startPoint` of the `left` curve, the `endPoint` of the `top` curve must share the same coordinates with the `startPoint` of the `right` curve, the `startPoint` of the `bottom` curve must share the same cooridinates with the end point of the `left` curve, and the `endPoint` of the `bottom` curve must share the same coordinates with the `endPoint` of the `right` curve.

```
         top
     |-------->|
left |         | right
     V-------->V
       bottom
```

All arguments are carefully validated and you will receive useful errors if any of the arguments are not valid.

## Primatives

Points look like this:

```typeScript
{
  x: 34,
  y: 44
}
```

Curves look like this:

```typeScript
{
  startPoint: { x: 0, y: 0},
  controlPoint1: { x: 0, y: 33},
  controlPoint2: { x: 0, y: 66},
  endPoint: { x: 0, y: 100}
}
```

Bounding curves look like this, where each item is curve.

```typeScript
{
  top,
  bottom,
  left,
  right
}
```

## A note on naming and the underlying math

Because a coons-patch is not bounded to x and y coordinates, the parameters `u` and `v` are used in algebraic descriptions to represent to two axes of the patch. Similarly `t` is used to for a single axes. The naming of the API reflects this so keep closer to the underlying math. In all cases, these parameters (`u`, `v` and `t`) are only valid in the range 0–1, where 0 represents the beginning of a surface along that axis, and 1 represents the end. In this respect, the values can be thought about as ratios representing a position along a path from start to end. So a `u` value of 0 and `v` value of 0 would represnt the top-left corner and a `u` value of 1 and `v` value of 1 would represent the bottom-right corner.

## Interpolation functions

A large part of the work done by this package involves interpolation. To locate a point on the surface, it performs linear interpolation along each axis, followed by bilinear interpolation. This package supplies two different types of interpolation that you can configure, and you can provide your own interpolations if you need. These interplation functions are exported alongside the API. `coonsPatch` accepts a different interpolation function for each axis.

The two types of interpolation that can be supplied to `interpolatePointOnCurve` are:

`interplolatePointOnCurveEvenlySpaced` (default) This is provides the most visually pleasing interplolation at a cost of performance. It uses a look-up table to perform interplation and results in a more even distribution of points. This function can be configured using a `precision` value. This improves tha accuracy of the interplation at the cost of performance. It defaults to `20`.

```typeScript
import coonsPatch, { interpolatePointOnCurveEvenlySpacedFactory } from 'coons-patch'

const interpolatePointOnCurve = interpolatePointOnCurveEvenlySpacedFactory({
  precision: 25,
})

coonsPatch(boundingCurves, 0.25, 0.9, {
  interpolatePointOnCurveU: interpolatePointOnCurve,
  interpolatePointOnCurveV: interpolatePointOnCurve
})
```

`interpolatePointOnCurveLinear` This is a much simpler type of interplolation, and results distribution of points being affected by the curvature of the bounds.

```typeScript
import coonsPatch, { interpolatePointOnCurveLinearFactory } from 'coons-patch'

const interpolatePointOnCurve = interpolatePointOnCurveLinearFactory()

coonsPatch(boundingCurves, 0.25, 0.9, {
  interpolatePointOnCurveU: interpolatePointOnCurve,
  interpolatePointOnCurveV: interpolatePointOnCurve
})
```

Write your own interpolation function with this signature:

```typeScript
(config: {precision: number}) => (t: number, curve: Curve): Point
```

### Dependencies

This project has a single dependency: [fast-memoize](https://www.npmjs.com/package/fast-memoize) which is used for memoization of expensive calculations.

## Maintainance

### Install

```bash

pnpm install

```

### Build

```bash
pnpm run build # Build once
pnpm run build-watch # Build and watch for changes
pnpm run test-coverage # Run tests and output a coverage report
```

### Preview build

```bash
pnpm run preview
```

### Generate docs

```bash
pnpm run docs
```

### Run tests

Tests are written using Jest.

```bash
pnpm run test # Run tests once
pnpm run test-watch # Run tests and watch for changes
```

The tests use snapshots of the data as test fixtures. These snapshots are generated using:

```bash
pnpm run test-snapshot
```

This will generate data for all of the fixure definitions in `./tests/fixtures.js`. This command should only be run when absolutely necessary as the current snapshots capture the verified working state of the data. To add new fixtures, add new definitions to `./tests/fixtures.js`.

### Lint

```bash
pnpm run lint-prettier
pnpm run lint-eslint
```

### Release

Releases are via semantic-release and executed on CI via Github actions. Docs are built and deployed to Vercel when changes on `main` are pushed to origin.
