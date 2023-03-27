import { AsyncRef, asyncRef, useMap } from '@asyncref/vue'
import { expectTypeOf } from 'vitest'

describe('map', () => {
  describe('return type', () => {
    it('is AsyncRef with Data as return type of the data projection function and matching Error ', () => {
      type DataIn = 'data-in'
      type Error = 'error'
      type DataOut = 'data-out'

      const ref = asyncRef<DataIn, Error>()

      const result = useMap(ref, () => undefined as DataOut)

      expectTypeOf(result).toMatchTypeOf<AsyncRef<DataOut, Error>>()
    })
  })
})
