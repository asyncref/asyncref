import type { AsyncRef } from '../asyncRef'
import { toValue, watch } from 'vue'
import { isRejected, isResolved } from '@asyncref/core'

export const toPromise = <TData, TError>(
  ref: AsyncRef<TData, TError>
) => {
  const state = toValue(ref)

  if (isResolved(state)) {
    return Promise.resolve(state.data)
  }

  if (isRejected(state)) {
    return Promise.reject(state.error)
  }

  return new Promise<TData>((resolve, reject) => {
    const stopWatch = watch(ref, (stateValue) => {
      stopWatch()

      if (isResolved(stateValue)) {
        resolve(stateValue.data)
        return
      }

      if (isRejected(stateValue)) {
        reject(stateValue.error)
      }
    })
  })
}
