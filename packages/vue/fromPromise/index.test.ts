import { fromPromise } from '.'
import { AsyncRef } from '../asyncRef'
import { expectLoading, expectRejected, expectResolved } from '../utilities/testUtilities'

describe('fromPromise', () => {
  describe('when function returns an unresolved promise', () => {
    it('returns AsyncRef in loading state', () => {
      const result = fromPromise(() => new Promise(() => {
        // do nothing
      }))

      expectLoading(result)
    })
  })

  describe('when function returns a resolved promise', () => {
    it('returns AsyncRef in resolved state', async () => {
      const result = fromPromise(() => Promise.resolve('resolved'))

      await nextTick()

      expectResolved(result).with('resolved')
    })
  })

  describe('when function returns a rejected promise', () => {
    it('returns AsyncRef in rejected state', async () => {
      const error = new Error('rejected')
      const result = fromPromise(() => Promise.reject(error))

      await nextTick()

      expectRejected(result).with(error)
    })
  })

  describe('when function returns a promise that is resolved later', () => {
    it('returns AsyncRef in resolved state', async () => {
      const { promise, resolve } = mockPromise()
      const result = fromPromise(() => promise)

      expectLoading(result)

      resolve('resolved')

      await nextTick()

      expectResolved(result).with('resolved')
    })
  })

  describe('when function returns a promise that is rejected later', () => {
    it('returns AsyncRef in rejected state', async () => {
      const { promise, reject } = mockPromise()
      const error = new Error('rejected')
      const result = fromPromise(() => promise)

      expectLoading(result)

      reject(error)

      await nextTick()

      expectRejected(result).with(error)
    })
  })

  describe('reactivity', () => {
    it('runs the function on dependency change', async () => {
      const dependency = ref(0)
      const result = fromPromise(() => Promise.resolve(dependency.value))

      await nextTick()

      expectResolved(result).with(0)

      dependency.value = 1
      await nextTick()

      expectResolved(result).with(1)
    })

    it('aborts the signal on dependency change', async () => {
      const dependency = ref(true)
      const { promise, resolve } = mockPromise()
      const onAbort = vi.fn()

      const result = fromPromise(async ({ signal }) => {
        signal.addEventListener('abort', onAbort)
        return await dependency.value
          ? promise
          : new Promise(() => {
          // do nothing
          })
      })

      await nextTick()
      expectLoading(result)
      expect(onAbort).not.toHaveBeenCalled()

      dependency.value = false
      await nextTick()

      expect(onAbort).toHaveBeenCalledOnce()
      resolve(1)
      await nextTick()
      expectLoading(result)
    })
  })

  describe('return type', () => {
    it('is AsyncRef with Data from promise and unknown Error', () => {
      type Data = 'data'

      const result = fromPromise(() => Promise.resolve(undefined as Data))

      expectTypeOf(result).toMatchTypeOf<AsyncRef<Data, unknown>>()
    })
  })
})

const mockPromise = <TData>() => {
  let resolve: (value: TData) => void
  let reject: (reason?: unknown) => void

  const promise = new Promise<TData>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return {
    promise,
    resolve,
    reject
  }
}
