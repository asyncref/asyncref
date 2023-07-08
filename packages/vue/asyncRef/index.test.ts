import type { AsyncRef } from '.'
import { describe, it, expectTypeOf, expect } from 'vitest'
import { asyncRefRejected, expectLoading, expectRejected, expectResolved } from '../utilities/testUtilities'
import { asyncRef } from '.'
import { nextTick } from 'vue'

describe('asyncRef', () => {
  describe('when called', () => {
    describe('without parameter', () => {
      it('is loading', () => {
        const ref = asyncRef()

        expectLoading(ref)
      })
    })

    describe('with parameter', () => {
      it.each([
        undefined,
        null,
        {},
        { foo: 'test' },
        'test',
        [],
        ['test']
      ])('is resolved with specified value', (data) => {
        const ref = asyncRef(data)

        expectResolved(ref).with(data)
      })
    })
  })

  describe('reject', () => {
    it('should reject loading state', () => {
      const ref = asyncRef<string, string>()

      ref.reject('rejected')

      expectRejected(ref).with('rejected')
    })

    it('should reject resolved state', () => {
      const ref = asyncRef<string, string>('resolved')

      ref.reject('rejected')

      expectRejected(ref).with('rejected')
    })

    it('should keep last rejection when called multiple times', () => {
      const ref = asyncRefRejected<string, string>('rejected')

      ref.reject('rejected 2')

      expectRejected(ref).with('rejected 2')
    })
  })

  describe('reset', () => {
    it('should not affect loading state', () => {
      const ref = asyncRef()

      ref.reset()

      expectLoading(ref)
    })

    it('should set resolved to loading state', () => {
      const ref = asyncRef('resolved')

      ref.reset()

      expectLoading(ref)
    })

    it('should set rejected to loading state', () => {
      const ref = asyncRefRejected<string, string>('rejected')

      ref.reset()

      expectLoading(ref)
    })
  })

  describe('resolve', () => {
    it('should resolve loading state', () => {
      const ref = asyncRef()

      ref.resolve('resolved')

      expectResolved(ref).with('resolved')
    })

    it('should keep last resolved value when resolved', () => {
      const ref = asyncRef('resolved 1')

      ref.resolve('resolved 2')

      expectResolved(ref).with('resolved 2')
    })

    it('should keep last resolved value when called multiple times', () => {
      const ref = asyncRef()

      ref.resolve('resolved 1')
      ref.resolve('resolved 2')

      expectResolved(ref).with('resolved 2')
    })

    it('should resolve rejected state', () => {
      const ref = asyncRefRejected<string, string>('rejected')

      ref.resolve('resolved')

      expectResolved(ref).with('resolved')
    })
  })

  describe('then', () => {
    it('should not continue when in loading state', () => {
      const ref = asyncRef<string, string>()
      let value = 'loading'

      ref.then(
        (success) => { value = success },
        (error) => { value = error }
      )

      expect(value).toBe('loading')
    })

    it('should resolve when in resolved state', async () => {
      const ref = asyncRef('success')
      let value = 'loading'

      await ref.then(
        (success) => { value = success },
        (error) => { value = error }
      )

      expect(value).toBe('success')
    })

    it('should resolve when in loading state and resolved', async () => {
      const ref = asyncRef<string, string>()
      let value = 'loading'

      ref.then(
        (success) => { value = success },
        (error) => { value = error }
      )

      ref.resolve('success')
      await nextTick()

      expect(value).toBe('success')
    })

    it('should resolve with first resolved value', async () => {
      const ref = asyncRef<string, string>()
      let value = 'loading'

      ref.then(
        (success) => { value = success },
        (error) => { value = error }
      )

      ref.resolve('success1')
      await nextTick()
      ref.resolve('success2')
      await nextTick()

      expect(value).toBe('success1')
    })

    it('should resolve when in loading state, resolved and awaited', async () => {
      const ref = asyncRef<string, string>()
      ref.resolve('success')

      const value = await ref

      expect(value).toBe('success')
    })

    it('should resolve when in resolved state and awaited', async () => {
      const ref = asyncRef('success')

      const value = await ref

      expect(value).toBe('success')
    })

    it('should reject when in rejected state', async () => {
      const ref = asyncRefRejected<string, string>('error')
      let value = 'loading'

      await ref.then(
        (success) => { value = success },
        (error) => { value = error }
      )

      expect(value).toBe('error')
    })

    it('should reject when in loading state and rejected', async () => {
      const ref = asyncRef<string, string>()
      let value = 'loading'

      ref.then(
        (success) => { value = success },
        (error) => { value = error }
      )

      ref.reject('error')
      await nextTick()

      expect(value).toBe('error')
    })

    it('should reject with first rejected value', async () => {
      const ref = asyncRef<string, string>()
      let value = 'loading'

      ref.then(
        (success) => { value = success },
        (error) => { value = error }
      )

      ref.reject('error1')
      await nextTick()
      ref.reject('error2')
      await nextTick()

      expect(value).toBe('error1')
    })

    it('should throw an error when in loading state, rejected and awaited', async () => {
      const ref = asyncRef<string, string>()

      ref.reject('error')

      await expect(ref).rejects.toThrow('error')
    })

    it('should throw an error when in rejected state and awaited', async () => {
      const ref = asyncRefRejected<string, string>('error')

      await expect(ref).rejects.toThrow('error')
    })
  })

  describe('return type', () => {
    it('should be AsyncRef', () => {
      type Data = 'data'
      type Error = 'error'
      const ref = asyncRef<Data, Error>()

      expectTypeOf(ref).not.toBeAny()
      expectTypeOf(ref).toMatchTypeOf<AsyncRef<Data, Error>>()
    })
  })
})
