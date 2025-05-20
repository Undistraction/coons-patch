import { validateT } from '../../../src/utils/validation'

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe(`validation`, () => {
  describe(`behaviour`, () => {
    describe(`validateT`, () => {
      it(`shouldn't throw with valid values between 0 and 1`, () => {
        expect(() => validateT(0)).not.toThrow()
        expect(() => validateT(1)).not.toThrow()
        expect(() => validateT(0.5)).not.toThrow()
      })

      it(`should throw with value less than 0`, () => {
        expect(() => validateT(-0.1)).toThrow(
          `t value must be between 0 and 1, but was '-0.1'`
        )
      })

      it(`should throw with value greater than 1`, () => {
        expect(() => validateT(1.1)).toThrow(
          `t value must be between 0 and 1, but was '1.1'`
        )
      })
    })
  })
})
