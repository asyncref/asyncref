import type { Ref } from 'vue'
import { expectTypeOf } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import { AsyncRef, asyncRef, useMatch, UseMatch } from '@asyncref/vue'

describe('match', () => {
  describe('return type', () => {
    it('is ref of union of matcher return types', () => {
      type Data = 'data'
      type Error = 'error'
      type WhenLoading = 'when-loading'
      type WhenData = 'when-data'
      type WhenError = 'when-error'

      const ref = asyncRef<Data, Error>()

      const result = useMatch(ref, {
        loading: () => undefined as WhenLoading,
        data: () => undefined as WhenData,
        error: () => undefined as WhenError
      })

      expectTypeOf(result).toMatchTypeOf<Ref<WhenLoading | WhenData | WhenError>>()
    })
  })

  describe('component', () => {
    describe('when loading', () => {
      it('renders loading slot', () => {
        const ref = asyncRef<string, string>()

        const wrapper = mountMatch(ref)

        expect(wrapper.text()).toEqual('loading')
      })
    })

    describe('when resolved', () => {
      it('renders data slot', async () => {
        const ref = asyncRef<string, string>()

        ref.resolve('resolved')

        const wrapper = mountMatch(ref)

        await nextTick()

        expect(wrapper.text()).toEqual('resolved')
      })
    })

    describe('when rejected', () => {
      it('renders error slot', async () => {
        const ref = asyncRef<string, string>()

        ref.reject('rejected')

        const wrapper = mountMatch(ref)

        await nextTick()

        expect(wrapper.text()).toEqual('rejected')
      })
    })
  })
})

const mountMatch = <TData, TError>(state: AsyncRef<TData, TError>) => {
  return mount(UseMatch, {
    props: {
      state: unref(state)
    },
    slots: {
      loading: 'loading',
      data: `
        <template #data="{ data }">
          <div>{{ data }}</div>
        </template>
      `,
      error: `
        <template #error="{ error }">
          <div>{{ error }}</div>
        </template>
      `
    }
  })
}
