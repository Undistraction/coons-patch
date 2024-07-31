declare module 'matrix-js' {
  export type Matrix = {
    (a: number, b: number): number
    constructor(a: number, b: number)
    inv: () => number[][]
    trans: () => number[][]
    gen: (i: number) => Matrix
    set: (i: number, i: number) => { to: (value: number) => number[][] }
    prod: (matrix: Matrix) => number[][]
  }

  export default function matrix(matrix: number[][]): Matrix

  type Size = (i: number, j: number) => number[][]

  matrix.gen = (i: number) => Size
}
