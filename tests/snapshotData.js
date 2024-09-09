import path from 'path'

// We want to lint before building, so dist/ dir won't necessarily be present
/* eslint-disable import/no-unresolved */
import coonsPatch from '../dist/index.js'
/* eslint-enable import/no-unresolved */
import fixtures from './fixtures.js'
import { __dirname, writeFileAsync } from './helpers.js'

console.log(`Generating data for fixtures`)

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

  console.log(`-----------------------------`)
  console.log(`coonsPatch`, input.coonsPatch.args)
  console.log(`-----------------------------`)
  const point = coonsPatch(...input.coonsPatch.args)

  print(point)

  const snapshot = JSON.stringify(
    {
      point,
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
