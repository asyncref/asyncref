import { describe, it, vi, expect, expectTypeOf } from 'vitest'
import { loadingState, rejectedState, resolvedState } from '../asyncState'
import { value } from '.'

describe('value', () => {
  describe('loadingState', () => {
    describe('without default value', () => {
      it('should return undefined', () => {
        const state = loadingState()

        expect(value(state)).toBeUndefined()
      })
    })

    describe('with default value', () => {
      it('should return default value', () => {
        const state = loadingState()

        expect(value(state, 'default')).toBe('default')
      })
    })
  })

  describe('loadingState', () => {
    describe('without default value', () => {
      it('should return value', () => {
        const state = resolvedState('value')

        expect(value(state)).toBe('value')
      })
    })

    describe('with default value', () => {
      it('should return value', () => {
        const state = resolvedState('value')

        expect(value(state, 'defaultValue')).toBe('value')
      })
    })
  })

  describe('rejectedState', () => {
    describe('without default value', () => {
      it('should return undefined', () => {
        const state = rejectedState('error')

        expect(value(state)).toBeUndefined()
      })
    })

    describe('with default value', () => {
      it('should return default value', () => {
        const state = rejectedState('error')

        expect(value(state, 'default')).toBe('default')
      })
    })
  })
})
