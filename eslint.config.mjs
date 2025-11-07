// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default withNuxt(
  // 添加 Prettier 相關配置
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // 關閉與 Prettier 衝突的 ESLint 規則
      'prettier/prettier': 'error',

      // Vue 相關規則
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-self-closing': 'off',

      // 其他可能衝突的規則
      indent: 'off',
      quotes: 'off',
      semi: 'off',
      'comma-dangle': 'off',
      'max-len': 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'computed-property-spacing': 'off',
      'space-in-parens': 'off',
      'space-before-function-paren': 'off',
      'keyword-spacing': 'off',
      'space-infix-ops': 'off',
      'eol-last': 'off',
      'no-trailing-spaces': 'off',
      'padded-blocks': 'off',
      'no-multiple-empty-lines': 'off',
      'operator-linebreak': 'off',
      'brace-style': 'off',
      camelcase: 'off',
      'new-cap': 'off',
      'func-call-spacing': 'off',
      'key-spacing': 'off',
      'no-multi-spaces': 'off',
      'no-extra-parens': 'off',
      'no-extra-semi': 'off',
      'no-unexpected-multiline': 'off',
      'no-unused-vars': 'warn', // 改為警告而不是錯誤
      'no-console': 'warn', // 改為警告而不是錯誤
      'no-undef': 'off', // 關閉未定義變數檢查（Nuxt 全域函數）
    },
  },
  {
    files: ['**/*.test.{js,ts}', 'tests/**/*', 'scripts/**/*', 'server/**/*', 'functions/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-dynamic-delete': 'off',
      'no-console': 'off',
    },
  },
  // 添加 prettier 配置來關閉衝突的規則
  prettier
)
