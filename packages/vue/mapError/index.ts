import type { AsyncRef } from '../asyncRef'
import { mapError as mapErrorState } from '@asyncref/core'

export const mapError = <TData, TErrorIn, TErrorOut>(
  state: AsyncRef<TData, TErrorIn>,
  projection: (data: TErrorIn) => TErrorOut
) => computed(() => mapErrorState(unref(state), projection))
