import type { Ref } from 'vue'
import type { AsyncRef } from '@asyncref/vue/asyncRef'
import { computed } from 'vue'
import { loadingState, rejectedState, resolvedState } from '@asyncref/core'
import { extend } from '../utilities/extend'

type Refs = {
  isLoading: Ref<boolean>,
  isError: Ref<boolean>,
  data: Ref<unknown>,
  error: Ref<unknown>
}

export const fromRefs = <
  TRefs extends Refs,
  TData = TRefs['data'] extends Ref<infer Data | undefined> ? Exclude<Data, undefined> : never,
  TError = TRefs['error'] extends Ref<infer Error | undefined> ? Exclude<Error, undefined> : never,
>(refs: TRefs): AsyncRef<TData, TError> => {
  const { isLoading, isError, data, error } = refs

  const result = computed(() => {
    if (isLoading.value) {
      return loadingState()
    }

    if (isError.value) {
      return rejectedState(error.value as TError)
    }

    return resolvedState(data.value as TData)
  })

  extend(result, { raw: refs })

  return result
}
