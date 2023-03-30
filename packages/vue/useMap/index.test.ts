import type { AsyncRef } from '../asyncRef'
import { describe, it, expectTypeOf } from 'vitest'
import { asyncRef } from '../asyncRef'
import { useMap } from '.'

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
