import { isLoading, isRejected, isResolved, loadingState, rejectedState, resolvedState } from '../asyncState'
import { map } from '.'

describe('map', () => {
  describe('resolvedState', () => {
    it('should return resolvedState with projected data', () => {
      const state = resolvedState('data')

      const projectionFn = vi.fn((data) => `resolved: ${data}`)

      const mapped = map(state, projectionFn)

      expect(isResolved(mapped)).toBe(true)
      expect(mapped).toHaveProperty('data', 'resolved: data')
      expect(projectionFn).toHaveBeenCalledOnce()
    })
  })

  describe('loadingState', () => {
    it('should return loadingState', () => {
      const state = loadingState()

      const projectionFn = vi.fn((data) => `resolved: ${data}`)

      const mapped = map(state, projectionFn)

      expect(isLoading(mapped)).toBe(true)
      expect(projectionFn).not.toHaveBeenCalled()
    })
  })

  describe('rejectedState', () => {
    it('should return rejectedState', () => {
      const state = rejectedState('error')

      const projectionFn = vi.fn((data) => `resolved: ${data}`)

      const mapped = map(state, projectionFn)

      expect(isRejected(mapped)).toBe(true)
      expect(mapped).toHaveProperty('error', 'error')
      expect(projectionFn).not.toHaveBeenCalled()
    })
  })
})
