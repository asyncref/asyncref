import { AsyncState, match } from '@asyncref/core'
import type { VNode } from 'vue'

type MatchProps<TData, TError> = {
  state: AsyncState<TData, TError>
}

type UseMatchSlots<TData, TError> = {
  loading?: () => VNode[]
  data?: (data: TData) => VNode[]
  error?: (error: TError) => VNode[]
  default?: (data: TData) => VNode[]
}

export const UseMatch = <TData, TError>(props: MatchProps<TData, TError>, { slots }: { slots: UseMatchSlots<TData, TError> }) => {
  const { state } = props

  return match(state, {
    loading: () => slots.loading?.(),
    data: (data) => slots.default?.(data) ?? slots.data?.(data),
    error: (error) => slots.error?.(error)
  })
}
