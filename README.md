# README

A [Coons patch](https://en.wikipedia.org/wiki/Coons_patch) is a kind of four-sided surface defined by four straight or curved edges, and this package provides a small API for getting information about the surface: points on the surface and lines running across the surface.

This package is used by [warp-grid](https://github.com/Undistraction/warp-grid) which supplies an extended API build on-top of this package for creating warped grids, and provides an API for modeling complex grids. To visualise and play with a coons patch, please see its interactive demo [here](https://warp-grid-editor.undistraction.com/).

[Documenation](https://coons-patch-docs.undistraction.com).

## Install package

```bash
npm add coons-patch
# or
yarn add coons-patch
# or
pnpm add coons-patch
```

## Quick-start

```javaScript
import {
  getSurfacePoint,
  getSurface,
  getSurfaceCurvesU,
  getSurfaceCurvesV,
  getSurfaceCurves,
  interpolatePointOnCurveLinear,
  interpolateCurveU,
  interpolateCurveV
} from 'coons-patch'

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

const point = getSurfacePath(boundingCurves, 0.1. 0.6)
const points = getSurfaceIntersectionPoints(boundingCurves, 6, 4)
const curvesU = getSurfaceCurvesU(boundingCurves, 6, 4)
const curvesV = getSurfaceCurvesU(boundingCurves, 6, 4)
const curves = getSurfaceCurvesU(boundingCurves, 6, 4)

// To change the way that points are interpolated on lines to a linear strategy:
const point = getSurfacePath(boundingCurves, 0.1. 0.6, {
  interpolatePointOnCurve: interpolatePointOnCurveLinear
})

// To change the way that lines are interpolated to use curves
const point = getSurfacePath(boundingCurves, 0.1. 0.6, {
  interpolateLineU: interpolateCurveU
})


```

This package only models a coons-patch and provides data about its model, however it does so in such a way that it can be easily rendered to the screen using SVG, canvas, or anything else you like.

To use any of the API you must provide a set of four **bounding curves** (`top`, `left`, `bottom` and `right`) in the form of four cubic Bezier curves. A cubic Bezier curve describes a line or curve using a start point (`startPoint`), an end point (`endPoint`) and two other control points(`controlPoint1` and `controlPoint2`). Each point has an `x` and `y` coordinate.

At minimum you must supply start and end points for each curves. If you do not supply `controlPoint1` it will be set to the same cooridinates as the start point, and if you do not supply `controlPoint2` it will be set to the same coordindates as the end point. If both control points are set to the same values as the start and end point, this will result in a straight line.

You also need to ensure that the four curves meet at the corners. The `top` and `bottom` curves run left to right, and `left` and `right` curves run top to bottom, so the `startPoint` of the `top` curve must share the same coordinates with the `startPoint` of the `left` curve, the `endPoint` of the `top` curve must share the same coordinates with the `startPoint` of the `right` curve, the `startPoint` of the `bottom` curve must share the same cooridinates with the end point of the `left` curve, and the `endPoint` of the `bottom` curve must share the same coordinates with the `endPoint` of the `right` curve.

There are a large number of validations that run on all the data you input and will throw Errors with useful messages if any of the data you supply is not valid.

Points look like this:

```javaScript
{
  x: 34,
  y: 44
}
```

Curves look like this:

```javaScript
{
  startPoint: { x: 0, y: 0},
  controlPoint1: { x: 0, y: 33},
  controlPoint2: { x: 0, y: 66},
  endPoint: { x: 0, y: 100}
}
```

Bounding curves look like this, where each item is curve.

```javaScript
{
  top,
  bottom,
  left,
  right
}
```

## A note on naming and the underlying math

Because a coons-patch is not bounded to x and y coordinates, the parameters `u` and `v` are used in algebraic descriptions to represent to two axes of the patch. Similarly `t` is used to for a single axes. The naming of the API reflects this so keep closer to the underlying math. In all cases, these parameters (`u`, `v` and `t`) are only valid in the range 0–1, where 0 represents the beginning of a surface along that axis, and 1 represents the end. In this respect, the values can be thought about as ratios representing a position along a path from start to end. So a `u` value of 0 and `v` value of 0 would represnt the top-left corner and a `u` value of 1 and `v` value of 1 would represent the bottom-right corner.

## API

The API can be broken into functions that return points and functions that return curves.

### Functions that return points

- `getSurfacePoint` Computes a point on a surface defined by four bounding curves at parameters u and v.
- `getSurfaceIntersectionPoints` Returns and array of oints on the surface where the provided rows and columns intersect.

### Functions that return curves

- `getSurfaceCurvesU` Returns a 2D array of surface curves along U-axis based on the provided bounding curves and columns.
- `getSurfaceCurvesV` Returns a 2D array of surface curves along V-axis based on the provided bounding curves and rows.
- `getSurfaceCurves` Returns a two 2D arrays of surface curves, one for each axis, based on the provided bounding curves, columns and rows.

When curves are calculated, they are calculated based on the the grid size, with a separate curve returned for each step of the column or row. This means that a single curve from top to bottom or left to right is made up of multiple sub-curves, running between column and row intersections. This ensures a much greater accuracy and allows new patches to be created for individual cells because each cell is itself surrounded by four bounding curves.

## Interpolation functions

When interpolating points and curves, the package uses a set of functions which can be swapped in and out for different effects. These function are exported alongside the API. You can also write and supply your own functions.

### `interpolatePointOnCurve`

All function take an additonal argument for `interpolatePointOnCurve` which is used to find points on the four curves when interpolating the position of surface point.

- `interpolatePointOnCurveEven` is the default strategy, and is designed to work around problems with `interpolationPointOnCurveLinear`. It provides much more accurate interpolation by generating a Look up Table (LuT) for each curve. Its accuracy can be adjusted using an additional `precison` parameter that can be passed to the function to increase or decrease its accuracy.The default is `20`. Its increased accuracy comes with a performance penalty, though this is minimised by using memoization.
- `interpolatePointOnCurveLinear` is a simpler and more performant strategy, however it results in uneven distribution of points along the curve. It can be an interesting effect, but is probably not what you want.

### `interpolateLineU` and `interpolateLineV`

These functions dictate how the lines/curves are interpolated. The curves that are returned will always be cubic Bezier curves, but the methods of interpolation result have very different results.

- `interpolateStraightLineU` and `interpolateStraightLineV` will make all lines along the their respective axes straight lines. It does this by collapsing the control points to the end points. This is significantly more performant than the alternative. This is the default.
- `interpolateCurveU` and `interpolateCurveV` will make all lines along the their respective axes curves. This is signifcantly more memory intensive.

### Dependencies

This project has two dependencies:

- [fast-memoize](https://www.npmjs.com/package/fast-memoize) for memoization
- [matrix-js](https://www.npmjs.com/package/matrix-js) for matrix math

### Thanks

Thanks to pomax for his help (and code) for curve fitting (which is much more complex than it might seem). His [A Primer on Bézier Curves](https://pomax.github.io/bezierinfo/) is a thing of wonder.

## Project

### Install

```bash

pnpm install

```

### Build

```bash
pnpm run build # Build once
pnpm run build-watch # Build and watch for changes
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

Due to the volume and complexity of the data returned from the API, the tests use snapshots of the data as test fixtures. These snapshots ar generated using:

```bash
pnpm run test-snapshot
```

This will generate data for all of the fixure definitions in `./tests/fixtures.js`. This command should only be run when absolutely necessary as the current snapshots capture the verified working state of the data. To add new fixtures add new definitions to `./tests/fixtures.js`.

### Lint

```bash
pnpm run lint-prettier
pnpm run lint-eslint
```

### Release

Releases are via semantic-release and executed on CI via Github actions. Docs are deployed to Vercel.
