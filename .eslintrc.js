module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  ignorePatterns: ['graphql-types.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier', 'import'],
  extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:prettier/recommended'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'type', 'parent', 'sibling', 'index', 'object'],
        pathGroups: ['@components/**', '@config/**', '@pages/**', '@type/**'].map((pattern) => ({
          pattern,
          group: 'parent',
          position: 'before',
        })),
        alphabetize: {
          order: 'asc',
        },
        warnOnUnassignedImports: true,
      },
    ],
  },
}
