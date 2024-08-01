const path = require('path')

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/recommended', '@vue/airbnb'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    semi: ['error', 'never'],
    'max-len': 'off',
    'linebreak-style': 'off',
    camelcase: ['error', { properties: 'never', ignoreDestructuring: true, ignoreImports: true }],
    'arrow-parens': ['error', 'as-needed'],
    'vue/multiline-html-element-content-newline': 'off',
    'no-param-reassign': [2, { props: false }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'import/no-cycle': 'off',
  },
  settings: {
    'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.vue'],
    'import/resolver': {
      alias: {
        map: [
          ['@', path.resolve(__dirname, 'src')],
          ['@themeConfig', path.resolve(__dirname, 'themeConfig.js')],
          ['@core', path.resolve(__dirname, 'src/@core')],
          ['@validations', path.resolve(__dirname, 'src/@core/utils/validations/validations.js')],
          ['@axios', path.resolve(__dirname, 'src/libs/axios')],
        ],
      },
      node: {
        extensions: ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.vue'],
      },
    },
  },
}
