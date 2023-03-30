import type { AsyncRef } from '../asyncRef'
import { watchEffect, computed } from 'vue'
import { asyncRef } from '../asyncRef'

export const fromPromise = <TData, TError = unknown>(
  fn: (options: { signal: AbortSignal }) => Promise<TData>
) => {
  const ref = asyncRef<TData, TError>()

  let controller: AbortController

  const resetController = () => {
    controller?.abort()
    controller = new AbortController()
    return controller.signal
  }

  watchEffect(async () => {
    const signal = resetController()
    ref.reset()

    try {
      const data = await fn({ signal })

      if (signal.aborted) {
        return
      }

      ref.resolve(data)
    } catch (error) {
      ref.reject(error)
    }
  })

  return computed(() => ref.value) as AsyncRef<TData, TError>
}
