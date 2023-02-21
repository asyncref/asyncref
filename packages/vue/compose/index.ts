import type { AsyncRef, UnwrapData, UnwrapError } from '../asyncRef'
import type { AsyncState } from '@asyncref/core'
import { compose as composeState } from '@asyncref/core'

type UnwrapRefArrayData<TRefs extends ReadonlyArray<AsyncRef<unknown, unknown>>> = {
  [K in keyof TRefs ]: UnwrapData<TRefs[K]>
}

type UnwrapRefArrayErrors<TRefs extends ReadonlyArray<AsyncRef<unknown, unknown>>> = {
  [K in keyof TRefs ]: UnwrapError<TRefs[K]>
}

export const compose = <TRefs extends Array<AsyncRef<unknown, unknown>>, TData>(
  refs: [...TRefs],
  fn: (values: UnwrapRefArrayData<TRefs>) => TData
) => computed(() => composeState(refs.map(r => unref(r)), fn) as AsyncState<TData, UnwrapRefArrayErrors<TRefs>[number]>)
