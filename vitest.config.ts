import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        'vue',
        'vitest',
        {
          vitest: [
            'expectTypeOf'
          ]
        }
      ],
      dts: './auto-imports.d.ts',
      eslintrc: {
        filepath: './.eslintrc-auto-import.json',
        enabled: true
      }
    })
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
