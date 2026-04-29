export default [
    {
        files: ['main.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: {
                document: 'readonly',
                window: 'readonly',
                localStorage: 'readonly',
                confirm: 'readonly',
                prompt: 'readonly',
                setTimeout: 'readonly',
                FileReader: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                console: 'readonly',
                marked: 'readonly'
            }
        },
        rules: {
            'eqeqeq': ['error', 'always'],
            'no-implicit-coercion': 'error',
            'no-ternary': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'no-unused-vars': ['error', { vars: 'local' }],
            'no-undef': 'error',
            'no-negated-condition': 'error',
            'no-nested-ternary': 'error',
            'no-unneeded-ternary': 'error'
        }
    }
];
