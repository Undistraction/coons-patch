/*------------------------------------------------------------------------------
 * All code in this file is based on work by Pomax on curve fitting, and all
 * credit is due to him.
 *
 * That work can be found here: https://pomax.github.io/bezierinfo/#curvefitting
 * ---------------------------------------------------------------------------*/

import matrix from 'matrix-js'
import { times } from './functional'
import { binomial } from './math'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const getRatioMatrix = (ratios) => {
  const ratioLength = ratios.length
  const data = times((i) => ratios.map((v) => v ** i), ratioLength)
  const tMatrix = matrix(data)
  const tMatrixTransposed = matrix(tMatrix.trans())
  return { tMatrix, tMatrixTransposed }
}

export const getBasisMatrix = (numberOfPoints) => {
  let basisMatrix = matrix(matrix.gen(0).size(numberOfPoints, numberOfPoints))

  for (let i = 0; i < numberOfPoints; i++) {
    const value = binomial(numberOfPoints - 1, i)
    const ret = basisMatrix.set(i, i).to(value)
    basisMatrix = matrix(ret)
  }

  for (var c = 0, r; c < numberOfPoints; c++) {
    for (r = c + 1; r < numberOfPoints; r++) {
      var sign = (r + c) % 2 === 0 ? 1 : -1
      var value = binomial(r, c) * basisMatrix(r, r)
      basisMatrix = matrix(basisMatrix.set(r, c).to(sign * value))
    }
  }

  return basisMatrix
}