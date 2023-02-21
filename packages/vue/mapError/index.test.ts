import { AsyncRef, asyncRef } from '../asyncRef'
import { mapError } from '.'
import { expectTypeOf } from 'vitest'

describe('map', () => {
  describe('return type', () => {
    it('is AsyncRef with matching Data and Error as return type of the error projection function', () => {
      type Data = 'data'
      type ErrorIn = 'error-in'
      type ErrorOut = 'error-out'

      const ref = asyncRef<Data, ErrorIn>()

      const result = mapError(ref, () => undefined as ErrorOut)

      expectTypeOf(result).toMatchTypeOf<AsyncRef<Data, ErrorOut>>()
    })
  })
})
