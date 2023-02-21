import { match } from '.'
import { loadingState, rejectedState, resolvedState } from '../asyncState'
import { expectTypeOf } from 'vitest'

type WhenLoading = 'loading'
type WhenData = 'data'
type WhenError = 'error'

describe('match', () => {
  describe('loadingState', () => {
    it('should call loading projection', () => {
      const state = loadingState()

      const loadingFn = vi.fn(() => 'loading')
      const resolvedFn = vi.fn((data: unknown) => `resolved: ${data}`)
      const rejectedFn = vi.fn((error: unknown) => `rejected: ${error}`)

      const result = match(state, {
        loading: loadingFn,
        data: resolvedFn,
        error: rejectedFn
      })

      expect(result).toBe('loading')

      expect(loadingFn).toHaveBeenCalledOnce()
      expect(resolvedFn).not.toHaveBeenCalled()
      expect(rejectedFn).not.toHaveBeenCalled()
    })

    it('should return an union of matcher return types', () => {
      const state = loadingState()

      const result = match(state, {
        loading: () => undefined as WhenLoading,
        data: () => undefined as WhenData,
        error: () => undefined as WhenError
      })

      expectTypeOf(result).toEqualTypeOf<WhenLoading | WhenData | WhenError>()
    })
  })

  describe('resolvedState', () => {
    it('should call data projection', () => {
      const state = resolvedState('data')

      const loadingFn = vi.fn(() => 'loading')
      const resolvedFn = vi.fn((data: unknown) => `resolved: ${data}`)
      const rejectedFn = vi.fn((error: unknown) => `rejected: ${error}`)

      const result = match(state, {
        loading: loadingFn,
        data: resolvedFn,
        error: rejectedFn
      })

      expect(result).toBe('resolved: data')

      expect(loadingFn).not.toHaveBeenCalled()
      expect(resolvedFn).toHaveBeenCalledOnce()
      expect(rejectedFn).not.toHaveBeenCalled()
    })

    it('should return an union of matcher return types', () => {
      const state = resolvedState('data')

      const result = match(state, {
        loading: () => undefined as WhenLoading,
        data: () => undefined as WhenData,
        error: () => undefined as WhenError
      })

      expectTypeOf(result).toEqualTypeOf<WhenLoading | WhenData | WhenError>()
    })
  })

  describe('rejectedState', () => {
    it('should call error projection', () => {
      const state = rejectedState('error')

      const loadingFn = vi.fn(() => 'loading')
      const resolvedFn = vi.fn((data: unknown) => `resolved: ${data}`)
      const rejectedFn = vi.fn((error: unknown) => `rejected: ${error}`)

      const result = match(state, {
        loading: loadingFn,
        data: resolvedFn,
        error: rejectedFn
      })

      expect(result).toBe('rejected: error')

      expect(loadingFn).not.toHaveBeenCalled()
      expect(resolvedFn).not.toHaveBeenCalled()
      expect(rejectedFn).toHaveBeenCalledOnce()
    })

    it('should return an union of matcher return types', () => {
      const state = rejectedState('error')

      const result = match(state, {
        loading: () => undefined as WhenLoading,
        data: () => undefined as WhenData,
        error: () => undefined as WhenError
      })

      expectTypeOf(result).toEqualTypeOf<WhenLoading | WhenData | WhenError>()
    })
  })
})
