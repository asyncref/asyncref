import { AsyncRef, asyncRef, useMapError } from '@asyncref/vue'
import { expectTypeOf } from 'vitest'

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
