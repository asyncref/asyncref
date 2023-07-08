import type { Ref } from 'vue'
import type { AsyncState } from '@asyncref/core'
import { computed, ref, unref, watch } from 'vue'
import { loadingState, resolvedState, rejectedState, isResolved, isRejected } from '@asyncref/core'
import { extend } from '../utilities/extend'

export type AsyncRef<TData, TError = Error> = Ref<AsyncState<TData, TError>>
export type UnwrapData<TAsyncRef> = TAsyncRef extends AsyncRef<infer TData, unknown> ? TData : never
export type UnwrapError<TAsyncRef> = TAsyncRef extends AsyncRef<unknown, infer TError> ? TError : never
export type UnwrapState<TRef> = TRef extends Ref<infer TState>
  ? TState extends AsyncState<infer TData, infer TError>
    ? AsyncState<TData, TError>
    : never
  : never

type AsyncRefControls<TData, TError> = {
  reset: () => void,
  resolve: (data: TData) => void,
  reject: (error: TError) => void
}

export const asyncRef = <
  TData,
  TError = Error
>(...args: [] | [TData]): AsyncRef<TData, TError> & AsyncRefControls<TData, TError> & PromiseLike<TData> => {
  const state = ref<AsyncState<TData, TError>>(
    args.length ? resolvedState(args[0]) : loadingState()
  ) as Ref<AsyncState<TData, TError>>

  const result = computed(() => state.value) as AsyncRef<TData, TError>

  const then: PromiseLike<TData>['then'] = (onFulfilled, onRejected) => {
    const stateValue = unref(state)

    if (isResolved(stateValue)) {
      return Promise.resolve(stateValue.data).then(onFulfilled, onRejected)
    }

    if (isRejected(stateValue)) {
      return Promise.reject(stateValue.error).then(onFulfilled, onRejected)
    }

    return new Promise<TData>((resolve, reject) => {
      const stopWatch = watch(state, (stateValue) => {
        stopWatch()

        if (isResolved(stateValue)) {
          resolve(stateValue.data)
          return
        }

        if (isRejected(stateValue)) {
          reject(stateValue.error)
        }
      })
    }).then(onFulfilled, onRejected)
  }

  extend(result, {
    reset: () => { state.value = loadingState() },
    resolve: (data: TData) => { state.value = resolvedState(data) },
    reject: (error: TError) => { state.value = rejectedState(error) },
    then
  })

  return result
}
