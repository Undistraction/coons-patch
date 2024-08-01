import { describe, expect, it } from 'vitest'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

// Reuse tests for correct validations on bounding curves
const testValidationOfColumnsAndRowsArgs = (functionUnderTest) => {
  describe(`columns`, () => {
    it(`should throw if columns is not supplied`, () => {
      expect(() => functionUnderTest()).toThrow(
        `columns must be an integer or an array, but it was 'undefined'`
      )
    })

    it(`should throw if columns is not an integer or array`, () => {
      expect(() => functionUnderTest(`7`)).toThrow(
        `columns must be an integer or an array, but it was '7'`
      )
    })

    it(`should throw a column is not an integer or object`, () => {
      expect(() => functionUnderTest([1, 2, `3`], 1)).toThrow(
        `A column must be an integer or an object, but it was '3'`
      )
    })
  })

  describe(`rows`, () => {
    it(`should throw if rows is not supplied`, () => {
      expect(() => functionUnderTest(2)).toThrow(
        `rows must be an integer or an array, but it was 'undefined'`
      )
    })

    it(`should throw if rows is not an integer or array`, () => {
      expect(() => functionUnderTest(2, `7`)).toThrow(
        `rows must be an integer or an array, but it was '7'`
      )
    })

    it(`should throw a column is not an integer or object`, () => {
      expect(() => functionUnderTest(2, [1, 2, `3`], 1)).toThrow(
        `A row must be an integer or an object, but it was '3'`
      )
    })
  })
}

export default testValidationOfColumnsAndRowsArgs
