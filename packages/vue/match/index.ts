import type { AsyncRef } from '../asyncRef'
import type { Matcher } from '@asyncref/core'
import { match as matchState } from '@asyncref/core'

export const match = <TData, TError, TWhenLoading, TWhenResolved, TWhenRejected>(
  ref: AsyncRef<TData, TError>,
  matcher: Matcher<TData, TError, TWhenLoading, TWhenResolved, TWhenRejected>
) => computed(() => matchState(unref(ref), matcher))
