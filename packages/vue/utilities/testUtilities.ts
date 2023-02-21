import { AsyncRef, asyncRef } from '../asyncRef'
import { isLoading, isRejected, isResolved } from '@asyncref/core'

export const asyncRefRejected = <TData, TError>(error: TError) => {
  const ref = asyncRef<TData, TError>()

  ref.reject(error)

  return ref
}

export const expectLoading = <TData, TError>(ref: AsyncRef<TData, TError>) => {
  expect(isLoading(unref(ref)))
}

export const expectResolved = <TData, TError>(ref: AsyncRef<TData, TError>) => {
  expect(isResolved(unref(ref))).toBe(true)

  return {
    with: (data: TData) => expect(unref(ref)).toHaveProperty('data', data)
  }
}

export const expectRejected = <TData, TError>(ref: AsyncRef<TData, TError>) => {
  expect(isRejected(unref(ref))).toBe(true)

  return {
    with: (error: TError) => expect(unref(ref)).toHaveProperty('error', error)
  }
}
