module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'eslint:recommended', 'plugin:perfectionist/recommended-alphabetical'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['jsx-a11y', 'prettier', 'import', 'react', 'react-hooks', '@typescript-eslint', 'perfectionist'],
  rules: {
    // note you must disable the base rule as it can report incorrect errors
    'no-use-before-define': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'import/order': [
    'warn',
        {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            alphabetize: {
                order: 'asc',
            },
            'newlines-between': 'always',
        },
    ],
    'import/extensions': ['error', 'never', { 'routes': 'always', 'gql': 'always', 'svg': 'always', 'png': 'always' }],
    'no-console': ['warn', { 'allow': ['warn', 'error'] }],
    'no-unexpected-multiline': 'error',
    'prefer-const': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    'perfectionist/sort-imports': 'off'
  },
  globals: {
      JSX: true,
  }
};
