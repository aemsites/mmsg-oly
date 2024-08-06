module.exports = {
  root: true,
  extends: ['airbnb-base', 'plugin:json/recommended', 'plugin:xwalk/recommended', 'prettier'],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    'import/prefer-default-export': 'error',
    'xwalk/max-cells': [
      'error',
      {
        '*': 4,
        // 'a-specific-model': 4,
        // 'another-specific-model': 2,
        'nl-calculator': 30,
        'page-metadata': 6,
      },
    ],
  },
};
