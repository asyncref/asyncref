import type { AsyncState, RejectedState, UnwrapStateData, UnwrapStateError } from '../asyncState'
import { isLoading, isRejected, isResolved, resolvedState } from '../asyncState'

type UnwrapStateArrayData<TStates> = {
  [K in keyof TStates ]: UnwrapStateData<TStates[K]>
}

type FlattenStateArrayErrors<TStates extends ReadonlyArray<AsyncState<unknown, unknown>>> = ({
  [K in keyof TStates ]: UnwrapStateError<TStates[K]>
})[number]

export const compose = <TStates extends ReadonlyArray<AsyncState<unknown, unknown>>, TData>(
  states: [...TStates],
  fn: (data: UnwrapStateArrayData<TStates>) => TData
): AsyncState<TData, FlattenStateArrayErrors<TStates>> => {
  const rejected = states.find(isRejected)
  if (rejected) {
    return rejected as RejectedState<FlattenStateArrayErrors<TStates>>
  }

  const loadingState = states.find(isLoading)
  if (loadingState) {
    return loadingState
  }

  const data = states
    .filter(isResolved)
    .map(v => v.data) as UnwrapStateArrayData<TStates>

  return resolvedState(fn(data))
}
