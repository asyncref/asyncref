import { describe, it, expect } from 'vitest'
import { loadingState, rejectedState, resolvedState } from '../asyncState'
import { data } from '.'

describe('value', () => {
  describe('loadingState', () => {
    describe('without default value', () => {
      it('should return undefined', () => {
        const state = loadingState()

        expect(data(state)).toBeUndefined()
      })
    })

    describe('with default value', () => {
      it('should return default value', () => {
        const state = loadingState()

        expect(data(state, 'default')).toBe('default')
      })
    })
  })

  describe('loadingState', () => {
    describe('without default value', () => {
      it('should return value', () => {
        const state = resolvedState('value')

        expect(data(state)).toBe('value')
      })
    })

    describe('with default value', () => {
      it('should return value', () => {
        const state = resolvedState('value')

        expect(data(state, 'defaultValue')).toBe('value')
      })
    })
  })

  describe('rejectedState', () => {
    describe('without default value', () => {
      it('should return undefined', () => {
        const state = rejectedState('error')

        expect(data(state)).toBeUndefined()
      })
    })

    describe('with default value', () => {
      it('should return default value', () => {
        const state = rejectedState('error')

        expect(data(state, 'default')).toBe('default')
      })
    })
  })
})
