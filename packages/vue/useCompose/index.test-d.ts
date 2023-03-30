import type { AsyncRef } from '../asyncRef'
import { ref } from 'vue'
import { describe, it, expectTypeOf } from 'vitest'
import { asyncRef } from '../asyncRef'
import { useMap } from '../useMap'
import { fromRefs } from '../fromRefs'
import { useCompose } from '.'

describe('useCompose', () => {
  describe('compose function', () => {
    it('should be called with correctly inferred types', () => {
      type DataA = 'data-a'
      type DataB = 'data-b'

      type Data = `${DataA} ${DataB}`

      const a = asyncRef<DataA>()
      const b = asyncRef<DataB>()

      useCompose([a, b], ([aValue, bValue]) => {
        expectTypeOf(aValue).toEqualTypeOf<DataA>()
        expectTypeOf(bValue).toEqualTypeOf<DataB>()

        return undefined as Data
      })
    })

    describe('when called with mapped functions', () => {
      it('should be called with correctly inferred types', () => {
        type DataA = 'data-a'
        type DataB = 'data-b'
        type DataC = 'data-c'

        const a = asyncRef(undefined as DataA)
        const b = useMap(a, (aValue) => aValue as DataB)
        const c = asyncRef(undefined as DataC)

        useCompose([b, c], ([bValue, cValue]) => {
          expectTypeOf(bValue).toEqualTypeOf<DataB>()
          expectTypeOf(cValue).toEqualTypeOf<DataC>()

          return undefined
        })
      })
    })

    describe('when called with result of fromRefs', () => {
      it('should be called with correctly inferred types', () => {
        type DataA = 'data-a'
        type DataB = 'data-b'

        const a = asyncRef(undefined as DataA)
        const b = fromRefs({
          isLoading: ref(false),
          isError: ref(false),
          data: ref<DataB>(),
          error: ref<Error>()
        })

        useCompose([a, b], ([aValue, bValue]) => {
          expectTypeOf(aValue).toEqualTypeOf<DataA>()
          expectTypeOf(bValue).toEqualTypeOf<DataB>()

          return undefined
        })
      })
    })
  })

  describe('return type', () => {
    it('should be AsyncRef with data as compose function return and error as union of all possible errors', () => {
      type ErrorA = 'error-a'
      type ErrorB = 'error-b'

      type Data = 'data'

      const a = asyncRef<Data, ErrorA>()
      const b = asyncRef<Data, ErrorB>()

      const result = useCompose([a, b], () => undefined as Data)

      expectTypeOf(result).toMatchTypeOf<AsyncRef<Data, ErrorA | ErrorB>>()
    })
  })
})
