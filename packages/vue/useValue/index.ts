import type { AsyncRef } from '../asyncRef'
import type { ComputedRef, Ref } from 'vue'
import { unref, computed } from 'vue'
import { value } from '@asyncref/core'

export const useValue = <TData, TError, TDefault = undefined>(
  ref: AsyncRef<TData, TError>,
  defaultValue: TDefault | Ref<TDefault> = undefined
): ComputedRef<TData | TDefault> => computed(() => value(unref(ref), unref(defaultValue)))
