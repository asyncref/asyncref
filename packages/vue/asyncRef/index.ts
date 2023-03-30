import type { Ref } from 'vue'
import type { AsyncState } from '@asyncref/core'
import { computed, ref } from 'vue'
import { loadingState, resolvedState, rejectedState } from '@asyncref/core'
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
>(...args: [] | [TData]): AsyncRef<TData, TError> & AsyncRefControls<TData, TError> => {
  const state = ref<AsyncState<TData, TError>>(
    args.length ? resolvedState(args[0]) : loadingState()
  ) as Ref<AsyncState<TData, TError>>

  const result = computed(() => state.value) as AsyncRef<TData, TError>

  extend(result, {
    reset: () => { state.value = loadingState() },
    resolve: (data: TData) => { state.value = resolvedState(data) },
    reject: (error: TError) => { state.value = rejectedState(error) }
  })

  return result
}
