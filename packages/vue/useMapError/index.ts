import type { AsyncRef } from '../asyncRef'
import { mapError } from '@asyncref/core'
import { unref, computed } from 'vue'

export const useMapError = <TData, TErrorIn, TErrorOut>(
  state: AsyncRef<TData, TErrorIn>,
  projection: (data: TErrorIn) => TErrorOut
): AsyncRef<TData, TErrorOut> => computed(() => mapError(unref(state), projection))
