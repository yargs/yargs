import js from '@eslint/js';
import {defineConfig, globalIgnores} from 'eslint/config';
import prettierConfig from 'eslint-config-prettier/flat';
import n from 'eslint-plugin-n';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    'build/',
    'coverage/',
    'example/',
    'helpers/',
    'lib/platform-shims/esm.mjs',
    'test/fixtures/',
    'example.mjs',
  ]),

  js.configs.recommended,
  n.configs['flat/recommended'],

  // Rules previously supplied by gts (formatting rules dropped: Prettier owns those).
  {
    rules: {
      'block-scoped-var': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-restricted-properties': [
        'error',
        {object: 'describe', property: 'only'},
        {object: 'it', property: 'only'},
      ],
      // Keep ESLint 8 behaviour for rules tightened in ESLint 9+.
      // Remove these overrides once the reported code has been cleaned up.
      'no-useless-assignment': 'off',
      'no-unused-vars': ['error', {caughtErrors: 'none'}],
    },
  },

  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.recommended],
    rules: {
      // Carried over from gts.
      '@typescript-eslint/ban-ts-comment': 'warn',
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      // Project-specific.
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },

  // Must be last: turns off rules that conflict with Prettier.
  prettierConfig,
]);
