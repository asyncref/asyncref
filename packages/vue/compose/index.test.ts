import { AsyncRef, asyncRef } from '../asyncRef'
import { compose } from '.'
import { expectLoading, expectResolved } from '../utilities/testUtilities'

describe('test', () => {
  describe('reactivity', () => {
    it('should be reactive', () => {
      const a = asyncRef<number>()
      const b = asyncRef<string>()

      const ref = compose([a, b], ([aValue, bValue]) => `${aValue} ${bValue}`)
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

      compose([a, b], ([aValue, bValue]) => {
        expectTypeOf(aValue).toEqualTypeOf<Data1>()
        expectTypeOf(bValue).toEqualTypeOf<Data2>()

        return undefined as Data
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

      const result = compose([a, b], () => undefined as Data)

      expectTypeOf(result).toMatchTypeOf<AsyncRef<Data, Error1 | Error2>>()
    })
  })
})
