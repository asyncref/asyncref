export const loadingState = () => ({ isLoading: true as const })
export type LoadingState = ReturnType<typeof loadingState>

export const resolvedState = <TData>(data: TData) => ({ isLoading: false as const, data })
export type ResolvedState<TData> = ReturnType<typeof resolvedState<TData>>

export const rejectedState = <TError>(error: TError) => ({ isLoading: false as const, error })
export type RejectedState<TError> = ReturnType<typeof rejectedState<TError>>

export type AsyncState<TData, TError> =
  | LoadingState
  | ResolvedState<TData>
  | RejectedState<TError>

export const isLoading = <TData, TError>(value: AsyncState<TData, TError>): value is LoadingState => value.isLoading
export const isResolved = <TData, TError>(value: AsyncState<TData, TError>): value is ResolvedState<TData> => !value.isLoading && 'data' in value
export const isRejected = <TData, TError>(value: AsyncState<TData, TError>): value is RejectedState<TError> => !value.isLoading && 'error' in value

export type UnwrapStateData<TState> = TState extends AsyncState<infer TData, unknown> ? TData : never
export type UnwrapStateError<TState> = TState extends AsyncState<unknown, infer TData> ? TData : never
