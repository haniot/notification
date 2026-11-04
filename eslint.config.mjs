import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended
})

export default [
    { ignores: ['**/node_modules', '**/dist', '**/coverage', '**/gulpfile.js', '**/test'] },
    ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
    {
        files: ['**/*.ts'],

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.mocha
            },
            ecmaVersion: 5,

            parser: tsParser,
            sourceType: 'module',
            parserOptions: {
                project: 'tsconfig.eslint.json'
            }
        },

        plugins: {
            '@stylistic': stylistic,
            '@typescript-eslint': typescriptEslint
        },

        rules: {
            // ENABLING STYLISTIC RULES
            '@stylistic/keyword-spacing': 'error',
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'never'],
            '@stylistic/space-infix-ops': 'error',
            '@stylistic/type-annotation-spacing': 'error',

            // ENABLING TYPESCRIPT PLUGIN RULES
            'dot-notation': 'off',
            '@typescript-eslint/dot-notation': 'error',
            '@typescript-eslint/explicit-member-accessibility': ['error', {
                accessibility: 'explicit',
                overrides: {
                    accessors: 'off',
                    constructors: 'no-public',
                    methods: 'explicit',
                    parameterProperties: 'no-public',
                    properties: 'explicit',
                },
            }],
            '@typescript-eslint/member-ordering': ['error', {
                default: {
                    memberTypes: ['field', 'constructor', 'method'],
                },
            }],
            '@typescript-eslint/naming-convention': ['error', {
                selector: ['interface'],
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z]',
                    match: true,
                },
            }, {
                    selector: ['class', 'enum'],
                    format: ['PascalCase'],
                }, {
                    selector: ['classMethod', 'function'],
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                }, {
                    selector: ['typeMethod'],
                    format: ['camelCase'],
                }],
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'error',
            'no-throw-literal': 'error',
            '@typescript-eslint/no-empty-object-type': ['error', {
                allowInterfaces: 'always'
            }],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', {
                vars: 'all',
                args: 'none',
                caughtErrors: 'none',
                ignoreRestSiblings: true,
            }],

            // ENABLING ESLINT RULES
            'eol-last': 'error',
            eqeqeq: ['error', 'always', {
                null: 'ignore',
            }],
            'guard-for-in': 'error',
            indent: ['error', 4],
            'max-len': ['error', 130],
            'no-eval': 'error',
            'no-labels': ['error', {
                allowLoop: true,
                allowSwitch: true,
            }],
            'no-new-wrappers': 'error',
            'no-trailing-spaces': ['error', {
                ignoreComments: true,
            }],
            'no-undef-init': 'error',
            'no-var': 'error',
            'no-whitespace-before-property': 'error',
            radix: 'error',

            // DISABLING SOME RULES
            'no-prototype-builtins': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-this-alias': 'off'
        }
    }
]
