import { computed } from 'vue'
import { describe, it } from 'vitest'
import { expectLoading, expectResolved } from '../utilities/testUtilities'
import { asyncRef } from '../asyncRef'
import { useCompose } from '.'

describe('useCompose', () => {
  describe('reactivity', () => {
    it('should be reactive', () => {
      const a = asyncRef<number>()
      const b = asyncRef<string>()

      const ref = useCompose([a, b], ([aValue, bValue]) => `${aValue} ${bValue}`)
      const result = computed(() => ref.value)

      expectLoading(result)

      a.resolve(1)

      expectLoading(result)

      b.resolve('test')

      expectResolved(result).with('1 test')
    })
  })
})
