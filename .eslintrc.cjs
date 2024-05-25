/* eslint-env node */
module.exports = {
  extends: [
    // 'eslint:recommended',
    //'plugin:@typescript-eslint/recommended-type-checked',
    "next/core-web-vitals",
    "plugin:deprecation/recommended",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "project": "./tsconfig.json" // <-- Point to your project's "tsconfig.json" or create a new one.
  },
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    // semi: 'error',

    'prefer-const': 'warn',
    'no-var': 'warn',
    "deprecation/deprecation": "warn",
    // 'no-undef': 'off',
    // 'no-unused-vars': 'off',
    // 'no-extra-semi': 'warn',

    // '@typescript-eslint/no-unused-vars': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',
    // '@typescript-eslint/no-var-requires': 'off',
    // '@typescript-eslint/no-unsafe-assignment': 'off',
    // '@typescript-eslint/no-unsafe-argument': 'off',
    // '@typescript-eslint/no-unsafe-member-access': 'off',
    // '@typescript-eslint/no-unsafe-call': 'off',
    // '@typescript-eslint/require-await': 'off',
    // '@typescript-eslint/no-misused-promises': 'off',
    // '@typescript-eslint/no-floating-promises': 'off',
    // '@typescript-eslint/restrict-template-expressions': 'off',
    // '@typescript-eslint/no-unsafe-return': 'off',
    // '@typescript-eslint/no-redundant-type-constituents': 'off',

  },
  ignorePatterns: ['*.js', '*.jsx', "**/(admin)/**"],
};