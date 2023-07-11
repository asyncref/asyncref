import type { AsyncRef } from '.'
import { describe, it, expectTypeOf } from 'vitest'
import { asyncRefRejected, expectLoading, expectRejected, expectResolved } from '../utilities/testUtilities'
import { asyncRef } from '.'

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
