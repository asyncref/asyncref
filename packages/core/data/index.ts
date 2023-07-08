import type { AsyncState } from '../asyncState'
import { isResolved } from '../asyncState'

export const data = <TData, TError, TDefault>(
  state: AsyncState<TData, TError>,
  defaultValue?: TDefault
) => isResolved(state) ? state.data : defaultValue as TData | TDefault

/** @deprecated('`value` is deprecated, use `data` instead') */
export const value = data
