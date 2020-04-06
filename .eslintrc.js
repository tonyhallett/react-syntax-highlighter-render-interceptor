module.exports = {
  ignorePatterns:['__tests__/*.ts'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'airbnb',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      mjs: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    'import/no-extraneous-dependencies': ['error', {'packageDir': './'}],
    'import/prefer-default-export':'off',
    'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
    "react/static-property-placement":'off'
    
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.d.ts'
        ]
      }
    }
  },
  overrides: [
    /* {
      files:['__tests__/*.ts'],
      // could extend https://www.npmjs.com/package/eslint-plugin-jest
      env:{
        jest:true
      }
    }, */
    {
      files:['src/*.ts'],
      rules: {
        'import/no-cycle':'off',
        'react/prop-types':'off'
      }
    }
  ]
};
