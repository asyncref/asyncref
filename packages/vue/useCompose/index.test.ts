import type { AsyncRef } from '../asyncRef'
import { computed } from 'vue'
import { describe, it, expectTypeOf } from 'vitest'
import { expectLoading, expectResolved } from '../utilities/testUtilities'
import { asyncRef } from '../asyncRef'
import { useMap } from '../useMap'
import { useCompose } from '.'

describe('test', () => {
  describe('reactivity', () => {
    it('should be reactive', () => {
      const a = asyncRef<number>()
      const b = asyncRef<string>()

      const ref = useCompose([a, b], ([aValue, bValue]) => `${aValue} ${bValue}`)
      const result = computed(() => ref.value)

      expectLoading(result)

      a.resolve(1)

      expectLoading(result)

      b.resolve('test')

      expectResolved(result).with('1 test')
    })
  })

  describe('compose function', () => {
    it('should be called with correctly inferred types', () => {
      type Data1 = 'data1'
      type Data2 = 'data2'

      type Data = `${Data1} ${Data2}`

      const a = asyncRef<Data1>()
      const b = asyncRef<Data2>()

      useCompose([a, b], ([aValue, bValue]) => {
        expectTypeOf(aValue).toEqualTypeOf<Data1>()
        expectTypeOf(bValue).toEqualTypeOf<Data2>()

        return undefined as Data
      })
    })

    describe('when called with mapped functions', () => {
      it('should be called with correctly inferred types', () => {
        type DataA = 'data1'
        type DataB = 'data2'
        type DataC = 'data2'

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
  })

  describe('return type', () => {
    it('should be AsyncRef with data as compose function return and error as union of all possible errors', () => {
      type Error1 = 'error1'
      type Error2 = 'error2'

      type Data = 'data'

      const a = asyncRef<Data, Error1>()
      const b = asyncRef<Data, Error2>()

      const result = useCompose([a, b], () => undefined as Data)

      expectTypeOf(result).toMatchTypeOf<AsyncRef<Data, Error1 | Error2>>()
    })
  })
})
