import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    settings: {
      react: { version: 'detect' }
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    rules: {
      // ── Logic ──────────────────────────────────────────────────────────────
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react/prop-types': 'off',

      // ── JSX formatting ─────────────────────────────────────────────────────
      'react/jsx-indent':               ['warn', 2],
      'react/jsx-indent-props':         ['warn', 2],
      'react/jsx-closing-bracket-location': ['warn', 'line-aligned'],
      'react/jsx-closing-tag-location': 'warn',
      'react/jsx-curly-spacing':        ['warn', { when: 'never', children: true }],
      'react/jsx-props-no-multi-spaces': 'warn',
      'react/jsx-tag-spacing':          ['warn', { beforeSelfClosing: 'always' }],
      'react/jsx-wrap-multilines':      ['warn', {
        declaration: 'parens-new-line',
        assignment:  'parens-new-line',
        return:      'parens-new-line',
        arrow:       'parens-new-line',
      }],
    }
  }
])
