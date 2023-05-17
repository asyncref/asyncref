import { AsyncState, match } from '@asyncref/core'
import type { VNode } from 'vue'

type UseMatchProps<TData, TError> = {
  state: AsyncState<TData, TError>
}

type UseMatchSlots<TData, TError> = {
  loading?: () => VNode[]
  data?: (data: TData) => VNode[]
  error?: (error: TError) => VNode[]
  default?: (data: TData) => VNode[]
}

export const UseMatch = <TData, TError = unknown>(
  props: UseMatchProps<TData, TError>,
  { slots }: { slots: UseMatchSlots<TData, TError> }
) => {
  return match(props.state, {
    loading: () => slots.loading?.(),
    data: (data) => slots.default?.(data) ?? slots.data?.(data),
    error: (error) => slots.error?.(error)
  })
}
