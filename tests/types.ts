import type {
  BoundingCurves,
  CoonsPatchConfig,
  InterpolationParameters,
} from '../src/types'

export interface Fixture {
  name: string
  skipTest: boolean
  input: {
    coonsPatch: {
      args: [BoundingCurves, InterpolationParameters, CoonsPatchConfig?]
    }
  }
}
