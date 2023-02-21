import type { AsyncRef } from '../asyncRef'
import { map as mapState } from '@asyncref/core'

export const map = <TDataIn, TDataOut, TError>(
  state: AsyncRef<TDataIn, TError>,
  projection: (data: TDataIn) => TDataOut
) => computed(() => mapState(unref(state), projection))
