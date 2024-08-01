import path from 'path'
import {
  getSurfaceCurves,
  getSurfaceCurvesU,
  getSurfaceCurvesV,
  getSurfaceIntersectionPoints,
  getSurfacePoint,
} from '../src/index.js'

import fixtures from './fixtures.js'
import { __dirname, writeFileAsync } from './helpers.js'

console.log('Generating data for fixtures')

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const print = (o) => console.log(JSON.stringify(o))

fixtures.forEach(async ({ name, input, skipSnapshot }) => {
  if (skipSnapshot) {
    console.log(`Skipping snapsot for '${name}'`)
    return
  } else {
    console.log(`Generating data for '${name}'`)
  }

  console.log('-----------------------------')
  console.log('getSurfacePoint', input.api.getSurfacePoint.args)
  console.log('-----------------------------')
  const point = getSurfacePoint(...input.api.getSurfacePoint.args)

  print(point)

  console.log('-----------------------------')
  console.log('getSurfaceIntersectionPoints')
  console.log('-----------------------------')
  const intersectionPoints = getSurfaceIntersectionPoints(
    ...input.api.getSurfaceIntersectionPoints.args
  )

  print(intersectionPoints)

  console.log('-----------------------------')
  console.log('getSurfaceCurvesU')
  console.log('-----------------------------')
  const curvesU = getSurfaceCurvesU(...input.api.getSurfaceCurvesU.args)
  print(curvesU)

  console.log('-----------------------------')
  console.log('getSurfaceCurvesV')
  console.log('-----------------------------')
  const curvesV = getSurfaceCurvesV(...input.api.getSurfaceCurvesV.args)
  print(curvesV)

  console.log('-----------------------------')
  console.log('getSurfaceCurves')
  console.log('-----------------------------')
  const curves = getSurfaceCurves(...input.api.getSurfaceCurves.args)
  print(curves)

  const snapshot = JSON.stringify(
    {
      point,
      intersectionPoints,
      curvesU,
      curvesV,
      curves,
    },
    null,
    2
  )

  const filepath = path.join(__dirname, `./fixtures/${name}.json`)

  try {
    await writeFileAsync(filepath, snapshot)
    console.log(`Wrote snapshot to '${filepath}'`)
  } catch (error) {
    console.error(`Error writing snapshot`, error)
  }
})
