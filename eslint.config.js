import vuetify from 'eslint-config-vuetify';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import vuePlugin from 'eslint-plugin-vue';

export default [
  {
    ...vuetify(),
    ...eslintConfigPrettier,
    plugins: {
      prettier: prettierPlugin,
      vue: vuePlugin
    },
    rules: {
      'prettier/prettier': 'error',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always'
          }
        }
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/multi-word-component-names': 'off'
    }
  }
];
