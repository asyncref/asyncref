import type { AsyncState } from '../asyncState'
import { isResolved, resolvedState } from '../asyncState'

export const map = <TDataIn, TDataOut, TError>(
  state: AsyncState<TDataIn, TError>,
  projection: (data: TDataIn) => TDataOut
) => {
  if (isResolved(state)) {
    return resolvedState(projection(state.data))
  }

  return state
}
