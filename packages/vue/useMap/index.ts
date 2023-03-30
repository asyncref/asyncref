import type { AsyncRef } from '../asyncRef'
import { unref, computed } from 'vue'
import { map } from '@asyncref/core'

export const useMap = <TDataIn, TDataOut, TError>(
  state: AsyncRef<TDataIn, TError>,
  projection: (data: TDataIn) => TDataOut
): AsyncRef<TDataOut, TError> => computed(() => map(unref(state), projection))
