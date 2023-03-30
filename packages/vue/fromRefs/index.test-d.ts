import type { AsyncRef, UnwrapData } from '../asyncRef'
import { computed, ref } from 'vue'
import { describe, expectTypeOf, it } from 'vitest'
import { fromRefs } from '.'

describe('fromRefs', () => {
  describe('type inference', () => {
    describe('data', () => {
      it('should correctly inferred from ref', () => {
        type Data = 'data'

        const result = fromRefs(createRefs(false, false, 'data' as Data | undefined, 'rejected' as const))

        expectTypeOf<UnwrapData<typeof result>>().not.toEqualTypeOf<any>()
        expectTypeOf<UnwrapData<typeof result>>().not.toEqualTypeOf<unknown>()
        expectTypeOf<UnwrapData<typeof result>>().toEqualTypeOf<Data>()
        expectTypeOf(result).toMatchTypeOf<AsyncRef<Data, 'rejected'>>()
      })

      it('should correctly inferred from computed ref', () => {
        type Data = 'data'

        const refs = {
          isLoading: ref(false),
          isError: ref(false),
          data: computed(() => 'data' as Data | undefined),
          error: ref('rejected' as const)
        }

        const result = fromRefs(refs)

        expectTypeOf<UnwrapData<typeof result>>().not.toEqualTypeOf<any>()
        expectTypeOf<UnwrapData<typeof result>>().not.toEqualTypeOf<unknown>()
        expectTypeOf<UnwrapData<typeof result>>().toEqualTypeOf<Data>()
        expectTypeOf(result).toMatchTypeOf<AsyncRef<Data, 'rejected'>>()
      })
    })
  })
})

const createRefs = <TData, TError>(isLoading: boolean, isError: boolean, data: TData, error: TError) => {
  return {
    isLoading: ref(isLoading),
    isError: ref(isError),
    data: ref(data),
    error: ref(error)
  }
}
