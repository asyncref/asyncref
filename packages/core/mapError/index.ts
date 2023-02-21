import { AsyncState, isRejected, rejectedState } from '../asyncState'

export const mapError = <TData, TErrorIn, TErrorOut>(
  state: AsyncState<TData, TErrorIn>,
  projection: (error: TErrorIn) => TErrorOut
) => {
  if (isRejected(state)) {
    return rejectedState(projection(state.error))
  }

  return state
}
