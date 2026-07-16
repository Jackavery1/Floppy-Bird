import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'dev-dist/**'],
    },
    {
        files: [
            'src/**/*.js',
            'tests/**/*.js',
            'e2e/**/*.js',
            'e2e/**/*.mjs',
            'scripts/**/*.mjs',
        ],
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
    {
        files: ['e2e/**/*.spec.mjs'],
        rules: {
            'max-lines': ['warn', { max: 450, skipBlankLines: true, skipComments: true }],
        },
    },
];
