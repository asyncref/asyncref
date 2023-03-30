import type { AsyncState } from '../asyncState'
import { isLoading, isRejected, isResolved } from '../asyncState'

export type Matcher<TData, TError, TWhenLoading, TWhenResolved, TWhenRejected> = {
  loading: () => TWhenLoading;
  data: (data: TData) => TWhenResolved;
  error: (error: TError) => TWhenRejected;
}

export const match = <TData, TError, TWhenLoading, TWhenResolved, TWhenRejected>(
  state: AsyncState<TData, TError>,
  { loading, error, data }: Matcher<TData, TError, TWhenLoading, TWhenResolved, TWhenRejected>
) => {
  if (isLoading(state)) {
    return loading()
  }

  if (isResolved(state)) {
    return data(state.data)
  }

  if (isRejected(state)) {
    return error(state.error)
  }

  throw new Error('Invalid state')
}
