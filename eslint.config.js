import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
    },
    {
        files: ['src/**/*.js', 'tests/**/*.js', 'e2e/**/*.js', 'scripts/**/*.mjs'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
        },
    },
];
