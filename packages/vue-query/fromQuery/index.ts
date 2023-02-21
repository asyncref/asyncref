import type { UseQueryReturnType } from '@tanstack/vue-query'
import { extend } from '@vue-utilities/extend'
import { loadingState, resolvedState, rejectedState } from '@asyncref/core'

export const fromQuery = <TData, TError>(query: UseQueryReturnType<TData, TError>) => {
  const { isLoading, isError, data, error } = query

  const result = computed(() => {
    if (isLoading.value) {
      return loadingState()
    }

    if (isError.value) {
      return rejectedState(error.value)
    }

    return resolvedState(data.value)
  })

  extend(result, { query })

  return result
}
