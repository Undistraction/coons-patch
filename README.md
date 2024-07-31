# README

A [Coons patch](https://en.wikipedia.org/wiki/Coons_patch)

This package provides a small API for getting information about the surface: points on the surface and lines running across the surface.

This package is used by [warp-grid](https://github.com/Undistraction/warp-grid) which supplies an extended API for creating warped grids, including access to data about individual grid-cells, and use of gutters. There is an interactive demo for warp grid [here](https://warp-grid-editor.undistraction.com/) which will allow you to play with a coons patch on-screen.

This package only provides the data related to a coons-patch, but it does so in such a way that it can be easily rendered to the screen using SVG, canvas, or anything else that understands cubic Bezier curves.

To use any of the API functions you must provide a set of four bounding curves (`top`, `left`, `bottom` and `right`) in the form of four cubic Bezier curves. A cubic Bezier curve describes a line or curve using a start point (`startPoint`), an end point (`endPoint`) and two other control points(`controlPoint1` and `controlPoint2`). Each point has an `x` and `y` coordinates.

At minimum you must supply start and end points for each curves. If you do not supply `controlPoint1` it will be set to the same cooridinates as the start point, and if you do not supply `controlPoint2` it will be set to the same coordindates as the end point. If both control points are set to the same values as the start and end point it will result in a straight line. You also need to ensure that the four curves meet at the corners. The `top` and `bottom` curves run left to right, and `left` and `right` curves run top to bottom, so the `startPoint` of the `top` curve must share the same coordinates with the `startPoint` of the `left` curve, the `endPoint` of the `top` curve must share the same coordinates with the `startPoint` of the `right` curve, the `startPoint` of the `bottom` curve must share the same cooridinates with the end point of the `left` curve, and the `endPoint` of the `bottom` curve must share the same coordinates with the `endPoint` of the `right` curve.

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

## API

The API can be broken into functions that return points and functions that return curves.

### Points

- `getSurfacePoint` Computes a point on a surface defined by bounding curves at
  parameters u and v.
- `getSurfaceIntersectionPoints` Generates intersection points on the surface
  based on the provided bounding curves, columns, and rows.

### Curves

- `getSurfaceCurvesXAxis` Generates surface curves along the X-axis based on the
  provided bounding curves, columns, and rows.
- `getSurfaceCurvesYAxis` Generates surface curves along the Y-axis based on the
  provided bounding curves, columns, and rows.
- `getSurfaceCurves` Generates surface curves along both the X-axis and Y-axis
  based on the provided bounding curves, columns, and rows.

When curves are calculated, they are calculated based on the the grid size, with a separate curve returned for each step of the column or row. This means that a single curve from top to bottom or left to right is made up of multiple sub-curves, one for each column or row. This ensures a much greater accuracy and allows new patches to be created for individual cells because each cell is itself surrounded by four bounding curves.

## Interpolation functions

When interpolating points and curves, the package uses a set of functions which can be swapped in and out for different effects. These function are exported alongside the API. You can also write and supply your own functions.

### `interpolatePointOnCurve`

All function take an additonal argument for `interpolatePointOnCurve` which is used to find points on the four curves when interpolating the position of surface point.

- `interpolatePointOnCurveEven` is the default strategy, and is designed to work around problems with `interpolationPointOnCurveLinear`. It provides much more accurate interpolation by generating a Look up Table (LuT) for each curve. Its accuracy can be adjusted using an additional `precison` parameter that can be passed to the function to increase or decrease its accuracy.The default is `20`. Its increased accuracy comes with a performance penalty, though this is minimised by using memoization.
- `interpolatePointOnCurveLinear` is a simpler and more performant strategy, however it results in uneven distribution of points along the curve. It can be an interesting effect, but is probably not what you want.

### `interpolateLineOnXAxis` and `interpolateLineOnYAxis`

These functions dictate how the lines/curves are interpolated. The curves that are returned will always be cubic Bezier curves, but the methods of interpolation result have very different results.

- `interpolateStraightLinesU` and `interpolateStraightLineV` will make all lines along the their respective axes straight lines. It does this by collapsing the control points to the end points. This is significantly more performant than the alternative. This is the default.
- `interpolateCurvesOnXAxis` and `interpolateCurvesOnYAxis` will make all lines along the their respective axes curves. This is signifcantly more memory intensive.

## Install package

```bash
npm add coons-patch
yarn add coons-patch
pnpm add coons-patch
```

## Quick-start

TBD

# Project

## Install

```bash

pnpm install

```

## Build

```bash

pnpm run build # Build once
pnpm run build-watch # Build and watch for changes

```

## Preview build

```bash

pnpm run preview

```

## Run tests

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

## Lint

```bash
pnpm run lint-prettier
pnpm run lint-eslint
```

## Thanks

Thanks to pomax for his help (and code) for curve fitting (which is much more complex than it might seem). His [A Primer on Bézier Curves](https://pomax.github.io/bezierinfo/) is a thing of wonder.
