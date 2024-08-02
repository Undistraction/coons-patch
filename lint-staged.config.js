export default {
  '*.{js,json, html}': [`prettier  --write`],
  '*.{ts,js,cjs}': [`eslint --fix`],
}
