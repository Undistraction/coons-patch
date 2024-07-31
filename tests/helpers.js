import { readFile, writeFile } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const readFileAsync = promisify(readFile)
export const writeFileAsync = promisify(writeFile)

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

export const loadFixtureData = async (name) => {
  const filePath = path.join(__dirname, `./fixtures/${name}.json`)
  try {
    const fixureJSON = await readFileAsync(filePath)
    const result = JSON.parse(fixureJSON)
    return Promise.resolve(result)
  } catch (error) {
    throw new Error(`Couldn't load fixture named: '${name}', ${error}`)
  }
}
