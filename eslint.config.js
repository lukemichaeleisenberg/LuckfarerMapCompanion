import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,ts,tsx}'],
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
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    // Root-level config files run in Node, not the browser.
    files: ['*.{js,ts}'],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        // vite.config.ts lives in tsconfig.node.json, which the project
        // service doesn't discover; lint it against the default project.
        projectService: {
          allowDefaultProject: ['vite.config.ts']
        },
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      // The TS-aware rule replaces the base one (which false-positives on
      // things like type parameters).
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]
    }
  }
])
