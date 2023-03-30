import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
  ],
  resolve: {
    alias: {
      '@asyncref/core': '/packages/core/index.ts',
      '@asyncref/vue': '/packages/vue/index.ts',
      '@vue-utilities': '/packages/vue/utilities'
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom'
  }
})
