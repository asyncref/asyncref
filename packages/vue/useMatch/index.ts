import type { Matcher } from '@asyncref/core'
import type { AsyncRef } from '../asyncRef'
import { unref, computed, ComputedRef } from 'vue'
import { match } from '@asyncref/core'

export const useMatch = <TData, TError, TWhenLoading, TWhenResolved, TWhenRejected>(
  ref: AsyncRef<TData, TError>,
  matcher: Matcher<TData, TError, TWhenLoading, TWhenResolved, TWhenRejected>
): ComputedRef<TWhenLoading | TWhenResolved | TWhenRejected> => computed(() => match(unref(ref), matcher))
