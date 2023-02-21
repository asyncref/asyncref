import { fromQuery } from './index'
import { QueryClient, useQuery } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { expectLoading, expectRejected, expectResolved } from '@vue-utilities/testUtilities'

describe.skip('fromQuery', () => {
  describe('when query is loading', () => {
    it('returns AsyncRef in loading state', async () => {
      const query = setupQueryClient((queryClient) => useQuery({
        queryKey: ['test'],
        queryFn: () => new Promise(() => {
          // do nothing
        }),
        queryClient
      }))

      const result = fromQuery(query)

      await nextTick()
      await nextTick()
      expectLoading(result)
    })
  })

  describe('when query is resolved', () => {
    it('returns AsyncRef in resolved state', async () => {
      const query = setupQueryClient((queryClient) => useQuery({
        queryKey: ['test'],
        queryFn: () => Promise.resolve('resolved'),
        queryClient
      }))

      const result = fromQuery(query)

      await nextTick()
      await nextTick()
      expectResolved(result).with('resolved')
    })
  })

  describe('when query is rejected', () => {
    it('returns AsyncRef in rejected state', async () => {
      const error = new Error('rejected')

      const query = setupQueryClient((queryClient) => useQuery({
        queryKey: ['test'],
        queryFn: () => Promise.reject(error),
        queryClient
      }))

      const result = fromQuery(query)

      await nextTick()
      await nextTick()
      expectRejected(result).with(error)
    })
  })

  describe('when query is resolved later', () => {
    it('returns AsyncRef in resolved state', async () => {
      const { promise, resolve } = mockPromise()

      const query = setupQueryClient((queryClient) => useQuery({
        queryKey: ['test'],
        queryFn: () => promise,
        queryClient
      }))

      const result = fromQuery(query)

      await nextTick()
      await nextTick()
      expectLoading(result)

      resolve('resolved')

      await nextTick()
      await nextTick()
      expectResolved(result).with('resolved')
    })
  })

  describe('when query is rejected later', () => {
    it('returns AsyncRef in rejected state', async () => {
      const { promise, reject } = mockPromise()
      const error = new Error('rejected')

      const query = setupQueryClient((queryClient) => useQuery({
        queryKey: ['test'],
        queryFn: () => promise,
        queryClient
      }))

      const result = fromQuery(query)

      await nextTick()
      await nextTick()
      expectLoading(result)

      reject(error)

      await nextTick()
      await nextTick()
      expectRejected(result).with(error)
    })
  })
})

const setupQueryClient = <TQuery>(setup: (client: QueryClient) => TQuery) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })

  let result: TQuery

  mount(defineComponent({
    setup: () => {
      result = setup(client)
    },
    render: () => null
  }))

  return result
}

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
