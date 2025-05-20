import type CustomMatchers from 'jest-extended'
import 'vitest'

/* eslint-disable */

// This file provides type definitions for the jest-extended library.
declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining<T = any> extends CustomMatchers<T> {}
  interface ExpectStatic<T = any> extends CustomMatchers<T> {}
}
