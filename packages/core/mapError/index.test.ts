import { describe, it, vi, expect } from 'vitest'
import { isLoading, isRejected, isResolved, loadingState, rejectedState, resolvedState } from '../asyncState'
import { mapError } from '.'

describe('mapError', () => {
  describe('resolvedState', () => {
    it('should return resolvedState', () => {
      const state = resolvedState('data')

      const projectionFn = vi.fn((error) => `rejected: ${error}`)

      const mapped = mapError(state, projectionFn)

      expect(isResolved(mapped)).toBe(true)
      expect(mapped).toHaveProperty('data', 'data')
      expect(projectionFn).not.toHaveBeenCalled()
    })
  })

  describe('loadingState', () => {
    it('should return loadingState', () => {
      const state = loadingState()

      const projectionFn = vi.fn((error) => `rejected: ${error}`)

      const mapped = mapError(state, projectionFn)

      expect(isLoading(mapped)).toBe(true)
      expect(projectionFn).not.toHaveBeenCalled()
    })
  })

  describe('rejectedState', () => {
    it('should return rejectedState with projected error', () => {
      const state = rejectedState('error')

      const projectionFn = vi.fn((error) => `rejected: ${error}`)

      const mapped = mapError(state, projectionFn)

      expect(isRejected(mapped)).toBe(true)
      expect(mapped).toHaveProperty('error', 'rejected: error')
      expect(projectionFn).toHaveBeenCalledOnce()
    })
  })
})
