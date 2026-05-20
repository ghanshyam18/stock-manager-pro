import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@next/next': nextPlugin,
      'simple-import-sort': simpleImportSort,
      'jsx-a11y': jsxA11y,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...prettierConfig.rules,

      // Formatting
      'prettier/prettier': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // TypeScript strictness
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',

      // React engineering standards
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unstable-nested-components': 'error',
      'react/no-array-index-key': 'warn',
      'react-hooks/exhaustive-deps': 'warn',

      // Console discipline
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    ignores: ['.next/', 'out/', 'node_modules/', 'public/', 'next-env.d.ts'],
  },
];

export default eslintConfig;
