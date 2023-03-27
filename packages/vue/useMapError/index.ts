import type { AsyncRef } from '../asyncRef'
import { mapError } from '@asyncref/core'

export const useMapError = <TData, TErrorIn, TErrorOut>(
  state: AsyncRef<TData, TErrorIn>,
  projection: (data: TErrorIn) => TErrorOut
) => computed(() => mapError(unref(state), projection))
