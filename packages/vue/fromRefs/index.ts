import type { Ref } from 'vue'
import { computed } from 'vue'
import { loadingState, rejectedState, resolvedState } from '@asyncref/core'
import { extend } from '../utilities/extend'

type Refs<TData, TError> = {
  isLoading: Ref<boolean>,
  isError: Ref<boolean>,
  data: Ref<TData | undefined>,
  error: Ref<TError | undefined>
}

export const fromRefs = <TData, TError, TRefs extends Refs<TData, TError>>(refs: TRefs) => {
  const { isLoading, isError, data, error } = refs

  const result = computed(() => {
    if (isLoading.value) {
      return loadingState()
    }

    if (isError.value) {
      return rejectedState(error.value)
    }

    return resolvedState(data.value)
  })

  extend(result, { raw: refs })

  return result
}
