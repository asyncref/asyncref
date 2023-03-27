import type { AsyncRef } from '../asyncRef'
import { map } from '@asyncref/core'

export const useMap = <TDataIn, TDataOut, TError>(
  state: AsyncRef<TDataIn, TError>,
  projection: (data: TDataIn) => TDataOut
) => computed(() => map(unref(state), projection))
