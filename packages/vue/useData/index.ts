import type { AsyncRef } from '../asyncRef'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { unref, computed, toValue } from 'vue'
import { data } from '@asyncref/core'

export const toData = <TData, TError, TDefault = undefined>(
  ref: AsyncRef<TData, TError>,
  defaultValue?: MaybeRefOrGetter<TDefault>
): TData | TDefault => data(unref(ref), toValue(defaultValue))

export const useData = <TData, TError, TDefault = undefined>(
  ref: AsyncRef<TData, TError>,
  defaultValue?: MaybeRefOrGetter<TDefault>
): ComputedRef<TData | TDefault> => computed(() => toData(ref, defaultValue))

/** @deprecated('`useValue` is deprecated, use `useData` instead') */
export const useValue = useData
