import type { Ref } from 'vue'
import { describe, it, expectTypeOf } from 'vitest'
import { ref } from 'vue'
import { asyncRef } from '../asyncRef'
import { useData } from '.'

describe('useValue', () => {
  describe('return type', () => {
    describe('without default value', () => {
      it('is ref of value or undefined', () => {
        type Data = 'data'
        type Error = 'error'

        const state = asyncRef<Data, Error>()

        const result = useData(state)

        expectTypeOf(result).toMatchTypeOf<Ref<Data | undefined>>()
      })
    })

    describe('with constant default value', () => {
      it('is ref of value or default value', () => {
        type Data = 'data'
        type Error = 'error'
        type Default = 'default'

        const state = asyncRef<Data, Error>()

        const result = useData(state, 'default' as Default)

        expectTypeOf(result).toMatchTypeOf<Ref<Data | Default>>()
      })
    })

    describe('with ref default value', () => {
      it('is ref of value or ref value', () => {
        type Data = 'data'
        type Error = 'error'
        type Default = 'default'

        const state = asyncRef<Data, Error>()
        const defaultRef = ref<Default>('default')

        const result = useData(state, defaultRef)

        expectTypeOf(result).toMatchTypeOf<Ref<Data | Default>>()
      })
    })
  })
})
