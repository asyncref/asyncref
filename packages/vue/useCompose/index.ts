import type { AsyncRef, UnwrapData, UnwrapError } from '../asyncRef'
import type { AsyncState } from '@asyncref/core'
import { unref, computed } from 'vue'
import { compose } from '@asyncref/core'

type UnwrapRefArrayData<TRefs extends ReadonlyArray<AsyncRef<unknown, unknown>>> = {
  [K in keyof TRefs ]: UnwrapData<TRefs[K]>
}

type FlattenRefArrayErrors<TRefs extends ReadonlyArray<AsyncRef<unknown, unknown>>> = {
  [K in keyof TRefs ]: UnwrapError<TRefs[K]>
}[number]

export const useCompose = <TRefs extends Array<AsyncRef<unknown, unknown>>, TData>(
  refs: [...TRefs],
  fn: (values: UnwrapRefArrayData<TRefs>) => TData
): AsyncRef<TData, FlattenRefArrayErrors<TRefs>> => {
  return computed(() => compose(refs.map(r => unref(r)), fn as (data: unknown[]) => TData) as AsyncState<TData, FlattenRefArrayErrors<TRefs>>)
}
