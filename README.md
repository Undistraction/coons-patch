# README

This package allows you to generate a [Coons patch](https://en.wikipedia.org/wiki/Coons_patch) for a four sided shape whose bounds are defined by four cubic Bezier curves. The grid it calculates is very configurable, allowing you to modify a number of its features in some useful and interesting ways. It provides a simple API to allow you to retrieve metrics about the patch and grid to use however you need.

There is an [interactive demo](https://coons-patch.undistraction.com) which allows you to generate and manipulate a patch.

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
