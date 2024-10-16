const antfu = require('@antfu/eslint-config').default

module.exports = antfu(
  {
    formatters: true,
    // TypeScript and Vue are auto-detected, you can also explicitly enable them:
    // Disable jsonc and yaml support
    jsonc: false,
    yaml: false,
    md: false,
    // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
    ignores: [
      '**/fixtures',
    ],
    vue: {
      overrides: {
        'vue/operator-linebreak': ['error', 'before'],
        'vue/attribute-hyphenation': 'off',
      },
    },
    typescript: {
      overrides: {
      },
    },
  },
  // TS 文件
  {
    files: ['**/*.ts'],
    rules: {
      'ts/consistent-type-definitions': 'off',
      'ts/no-require-imports': 'off',
      'ts/no-var-requires': 'off',
    },
  },
  // 全部文件
  {
    rules: {
      'style/semi': ['error', 'never'],
      'camelcase': 'off',
    },
  },

)
