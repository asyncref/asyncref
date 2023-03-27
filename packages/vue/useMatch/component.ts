import { AsyncState, match } from '@asyncref/core'

type MatchProps<TData, TError> = {
  state: AsyncState<TData, TError>
}

export const UseMatch = <TData, TError>(props: MatchProps<TData, TError>, { slots }) => {
  const { state } = props

  return match(state, {
    loading: () => slots.loading?.(),
    data: (data) => slots.data?.({ data }),
    error: (error) => slots.error?.({ error })
  })
}
