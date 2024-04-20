/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    //'plugin:@typescript-eslint/recommended-type-checked',
    "next/core-web-vitals",
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  // parserOptions: {
  //   project: true,
  //   tsconfigRootDir: __dirname,
  // },
  root: true,
  rules: {
    // 세미콜론이 없으면 에러로 취급한다.
    // semi: 'error',
    // 기존 프로젝트에서는 'warn'으로 취급되지만, 'error'로 설정하면 에러로 취급한다.

    'prefer-const': 'warn',
    'no-var': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-extra-semi': 'warn',

    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',

  },
  ignorePatterns: ['*.js'],
};