import { describe, it, expect } from 'vitest'
import { loadingState, resolvedState, rejectedState, isLoading, isResolved, isRejected } from '../asyncState'

describe('loadingState', () => {
  describe('isLoading', () => {
    it('returns true ', () => {
      const state = loadingState()

      expect(isLoading(state)).toBe(true)
    })
  })

  describe('isResolved', () => {
    it('returns false ', () => {
      const state = loadingState()

      expect(isResolved(state)).toBe(false)
    })
  })

  describe('isRejected', () => {
    it('returns false ', () => {
      const state = loadingState()

      expect(isRejected(state)).toBe(false)
    })
  })
})

describe('resolvedState', () => {
  describe('isLoading', () => {
    it('returns false ', () => {
      const state = resolvedState('test')

      expect(isLoading(state)).toBe(false)
    })
  })

  describe('isResolved', () => {
    it('returns true ', () => {
      const state = resolvedState('test')

      expect(isResolved(state)).toBe(true)
    })
  })

  describe('isRejected', () => {
    it('returns false ', () => {
      const state = resolvedState('test')

      expect(isRejected(state)).toBe(false)
    })
  })

  test.each([
    undefined,
    null,
    1,
    'test',
    { foo: 'test' }
  ])('has data property with correct value', (data) => {
    const state = resolvedState(data)

    expect(state).toHaveProperty('data', data)
  })
})

describe('rejectedState', () => {
  describe('isLoading', () => {
    it('returns false ', () => {
      const state = rejectedState('test')

      expect(isLoading(state)).toBe(false)
    })
  })

  describe('isResolved', () => {
    it('returns false ', () => {
      const state = rejectedState('test')

      expect(isResolved(state)).toBe(false)
    })
  })

  describe('isRejected', () => {
    it('returns true ', () => {
      const state = rejectedState('test')

      expect(isRejected(state)).toBe(true)
    })
  })

  test.each([
    undefined,
    null,
    1,
    'test',
    { foo: 'test' }
  ])('has error property with correct value', (error) => {
    const state = rejectedState(error)

    expect(state).toHaveProperty('error', error)
  })
})
