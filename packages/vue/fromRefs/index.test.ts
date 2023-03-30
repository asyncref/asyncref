import { ref } from 'vue'
import { describe, it } from 'vitest'
import { expectLoading, expectRejected, expectResolved } from '@vue-utilities/testUtilities'
import { fromRefs } from '.'

describe('fromRefs', () => {
  describe('loadingState', () => {
    it('should be created when isLoading is true', () => {
      const refs = createRefs(true, false, 'resolved', 'rejected')

      const result = fromRefs(refs)

      expectLoading(result)
    })
  })

  describe('resolvedState', () => {
    it('should be created when isLoading is false and isError is false', () => {
      const refs = createRefs(false, false, 'resolved', 'rejected')

      const result = fromRefs(refs)

      expectResolved(result).with('resolved')
    })
  })

  describe('rejectedState', () => {
    it('should be created when isLoading is false and isError is true', () => {
      const refs = createRefs(false, true, 'resolved', 'rejected')

      const result = fromRefs(refs)

      expectRejected(result).with('rejected')
    })
  })
})

const createRefs = <TData, TError>(isLoading: boolean, isError: boolean, data: TData, error: TError) => {
  return {
    isLoading: ref(isLoading),
    isError: ref(isError),
    data: ref(data),
    error: ref(error)
  }
}
