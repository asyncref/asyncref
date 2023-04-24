import type { AsyncState } from '../asyncState'
import { isResolved } from '../asyncState'

export const value = <TData, TError, TDefault>(
  state: AsyncState<TData, TError>,
  defaultValue: TDefault = undefined
) => isResolved(state) ? state.data : defaultValue
