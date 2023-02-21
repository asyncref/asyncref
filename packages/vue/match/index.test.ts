import type { Ref } from 'vue'
import { asyncRef } from '../asyncRef'
import { match } from '.'
import { expectTypeOf } from 'vitest'

describe('match', () => {
  describe('return type', () => {
    it('is ref of union of matcher return types', () => {
      type Data = 'data'
      type Error = 'error'
      type WhenLoading = 'when-loading'
      type WhenData = 'when-data'
      type WhenError = 'when-error'

      const ref = asyncRef<Data, Error>()

      const result = match(ref, {
        loading: () => undefined as WhenLoading,
        data: () => undefined as WhenData,
        error: () => undefined as WhenError
      })

      expectTypeOf(result).toMatchTypeOf<Ref<WhenLoading | WhenData | WhenError>>()
    })
  })
})
