import type { AsyncState } from '../asyncState'
import { describe, it, expect, expectTypeOf } from 'vitest'
import { isLoading, isRejected, isResolved, loadingState, rejectedState, resolvedState } from '../asyncState'
import { map } from '../map'
import { compose } from '.'

describe('compose', () => {
  describe('when all composed states are resolved', () => {
    it('should return resolved state', () => {
      const a = resolvedState(1)
      const b = resolvedState('test')

      const result = compose([a, b], ([aValue, bValue]) => `${aValue} ${bValue}`)

      expect(isResolved(result)).toBe(true)
      expect(result).toHaveProperty('data', '1 test')
    })
  })

  describe('when any composed state is rejected', () => {
    it('should return rejected state', () => {
      const a = resolvedState(1)
      const b = rejectedState('test')

      const result = compose([a, b], () => undefined)

      expect(isRejected(result)).toBe(true)
      expect(result).toHaveProperty('error', 'test')
    })
  })

  describe('when any composed state is loading', () => {
    it('should return loading state', () => {
      const a = resolvedState(1)
      const b = loadingState()

      const result = compose([a, b], () => undefined)

      expect(isLoading(result)).toBe(true)
    })
  })

  describe('when composed states contain loading and error', () => {
    it('should return rejected state', () => {
      const a = rejectedState(1)
      const b = loadingState()

      const result = compose([a, b], () => undefined)

      expect(isRejected(result)).toBe(true)
    })
  })

  describe('when called with mapped functions', () => {
    it('should return resolved state', () => {
      const a = resolvedState('a')
      const a2 = map(a, (aValue) => `${aValue}2`)
      const b = resolvedState('b')

      const result = compose([a2, b], ([aValue, bValue]) => `${aValue} ${bValue}`)

      expect(isResolved(result)).toBe(true)
      expect(result).toHaveProperty('data', 'a2 b')
    })
  })

  describe('compose function', () => {
    it('should be called with correctly inferred types', () => {
      type Data1 = 'data1'
      type Data2 = 'data2'

      type Data = `${Data1} ${Data2}`

      const a = resolvedState(undefined as Data1)
      const b = resolvedState(undefined as Data2)

      compose([a, b], ([aValue, bValue]) => {
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

        const a = resolvedState(undefined as DataA)
        const b = map(a, (aValue) => aValue as DataB)
        const c = resolvedState(undefined as DataC)

        compose([b, c], ([bValue, cValue]) => {
          expectTypeOf(bValue).toEqualTypeOf<DataB>()
          expectTypeOf(cValue).toEqualTypeOf<DataC>()

          return undefined
        })
      })
    })
  })

  describe('return type', () => {
    it('should be AsyncState with data as compose function return and error as union of all possible errors', () => {
      type Error1 = 'error1'
      type Error2 = 'error2'

      type Data = 'data'

      const a = rejectedState(undefined as Error1)
      const b = rejectedState(undefined as Error2)

      const result = compose([a, b], () => undefined as Data)

      expectTypeOf(result).toMatchTypeOf<AsyncState<Data, Error1 | Error2>>()
    })
  })
})
