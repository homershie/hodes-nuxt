export default {
  // 基本格式化設定
  printWidth: 100, // 每行最多 100 個字符
  semi: false, // 不使用分號
  singleQuote: true, // 使用單引號
  trailingComma: 'es5', // 在 ES5 中有效的尾隨逗號
  tabWidth: 2, // 使用 2 個空格作為縮進
  useTabs: false, // 使用空格而不是 tab

  // Vue 相關設定
  vueIndentScriptAndStyle: false, // Vue 文件中的 script 和 style 標籤不縮進

  // 其他設定
  bracketSpacing: true, // 在對象字面量的括號之間添加空格
  bracketSameLine: false, // 將多行 HTML 元素的 `>` 放在下一行
  arrowParens: 'avoid', // 箭頭函數參數只有一個時不添加括號
  endOfLine: 'lf', // 使用 LF 作為行結束符

  // 覆蓋特定文件類型的設定
  overrides: [
    {
      files: '*.vue',
      options: {
        parser: 'vue',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
    {
      files: '*.scss',
      options: {
        parser: 'scss',
        singleQuote: false,
      },
    },
  ],
}
