import type CustomMatchers from 'jest-extended'
import 'vitest'

// eslint-disable-next-line quotes
declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining<T = any> extends CustomMatchers<T> {}
  interface ExpectStatic<T = any> extends CustomMatchers<T> {}
}
