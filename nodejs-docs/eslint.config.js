import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['**/dist']),
  js.configs.recommended,

  // Node.js ES modules: server/, client/vite.config.js, this file.
  // `nodeBuiltin` leaves out the CommonJS-only globals (require, module,
  // __dirname), so using them in an ES module is reported by `no-undef`,
  // just like Node.js throws at runtime.
  {
    files: ['**/*.{js,mjs}'],
    ignores: ['client/src/**'],
    languageOptions: { globals: globals.nodeBuiltin },
  },

  // CommonJS (.cjs). The Node.js docs show examples in both module systems.
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },

  // Browser code: React + JSX. Node-only globals such as `process` are not
  // defined here.
  {
    files: ['client/src/**/*.{js,jsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
