import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { asyncRef } from '../asyncRef'
import { toPromise } from '.'
import { asyncRefRejected } from '@vue-utilities/testUtilities'

describe('toPromise', () => {
  it('should not continue when in loading state', async () => {
    const ref = asyncRef<string, string>()
    let value = 'loading'

    toPromise(ref).then(
      (success) => { value = success },
      (error) => { value = error }
    )

    await nextTick()

    expect(value).toBe('loading')
  })

  it('should resolve when in loading state and resolved', async () => {
    const ref = asyncRef<string, string>()
    ref.resolve('success')

    const value = await toPromise(ref)

    expect(value).toBe('success')
  })

  it('should resolve when in resolved state and awaited', async () => {
    const ref = asyncRef('success')

    const value = await toPromise(ref)

    expect(value).toBe('success')
  })

  it('should throw an error when in loading state, rejected and awaited', async () => {
    const ref = asyncRef<string, string>()

    ref.reject('error')

    await expect(toPromise(ref)).rejects.toThrow('error')
  })

  it('should throw an error when in rejected state and awaited', async () => {
    const ref = asyncRefRejected<string, string>('error')

    await expect(toPromise(ref)).rejects.toThrow('error')
  })
})
