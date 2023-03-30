import type { AsyncRef } from '../asyncRef'
import { describe, it, expectTypeOf } from 'vitest'
import { asyncRef } from '../asyncRef'
import { useMapError } from '.'

describe('map', () => {
  describe('return type', () => {
    it('is AsyncRef with matching Data and Error as return type of the error projection function', () => {
      type Data = 'data'
      type ErrorIn = 'error-in'
      type ErrorOut = 'error-out'

      const ref = asyncRef<Data, ErrorIn>()

      const result = useMapError(ref, () => undefined as ErrorOut)

      expectTypeOf(result).toMatchTypeOf<AsyncRef<Data, ErrorOut>>()
    })
  })
})
