class Callable extends Function {
  private _bound

  constructor() {
    super(`...args`, `return this._bound.call(...args)`)
    this._bound = this.bind(this)
    return this._bound
  }
}

// eslint-disable-next-line quotes
declare module 'matrix-js' {
  export class Matrix extends Callable {
    constructor(a: number, b: number): Matrix
    trans: () => number[][]
    gen: (i: number) => Matrix
    set: (i: number, i: number) => { to: (value: number) => number[][] }
    prod: (matrix: Matrix) => number[][]
    inv: () => number[][]
    call(i: number, j: number): number
  }

  export default function matrix(matrix: number[][]): Matrix

  type Size = (i: number, j: number) => number[][]

  matrix.gen = (i: number) => Size(i)
}
